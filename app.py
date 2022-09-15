from flask import Flask, render_template,request, redirect, url_for
import json
import re, numpy as np, pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification, BertPreTrainedModel, BertModel,BertConfig,BertForTokenClassification
from torch.optim import lr_scheduler
from torch import nn
import tensorflow as tf
from sklearn import manifold
import torch
from tqdm import tqdm, trange
from torch.nn import functional as F
from transformers import pipeline

tokenizer = BertTokenizer.from_pretrained("dslim/bert-base-NER")
model = BertForTokenClassification.from_pretrained("dslim/bert-base-NER")
classifier = pipeline("token-classification", model = "vblagoje/bert-english-uncased-finetuned-pos")
classifier_ner = pipeline("ner", model=model, tokenizer=tokenizer)
tokenizer_base = BertTokenizer.from_pretrained("bert-base-uncased")
model_base = BertForSequenceClassification.from_pretrained("bert-base-uncased",num_labels=2,output_hidden_states=True,output_attentions =True)
tokenizer_large = BertTokenizer.from_pretrained("bert-large-uncased")
model_large = BertForSequenceClassification.from_pretrained("bert-large-uncased",num_labels=2,output_hidden_states=True,output_attentions =True)


path_checkpoint_base = "./model_base.pth"  #看要用第幾個epoch 
optimizer_base= torch.optim.Adam(model_base.parameters(), lr=1e-5)
checkpoint_base = torch.load(path_checkpoint_base, map_location="cpu")  
model_base.load_state_dict(checkpoint_base['net'])  
optimizer_base.load_state_dict(checkpoint_base['optimizer'])


path_checkpoint_large = "./model_large.pth"  #看要用第幾個epoch 
optimizer_large= torch.optim.Adam(model_large.parameters(), lr=1e-5)
checkpoint_large = torch.load(path_checkpoint_large, map_location="cpu")  
model_large.load_state_dict(checkpoint_large['net'])  
optimizer_large.load_state_dict(checkpoint_large['optimizer'])

            



def cross_attention(text,base_minlayer,base_maxlayer,large_minlayer,large_maxlayer,threshold):
    print('start')
    inputs_base = tokenizer_base(text, return_tensors="pt")
    outputs_base = model_base(**inputs_base)
    inputs_large = tokenizer_large(text, return_tensors="pt")
    outputs_large = model_large(**inputs_large)
    token = tokenizer_base.tokenize(text)
    token.insert(0,'[CLS]')
    token.append('[SEP]')
    set_base = set({})
    list_base = [0]
    new = classifier(text)
    new.append({'entity':'[SEP]'})
    new.insert(0,{'entity':'[CLS]'})

   

    print('start2')
    for i in range(base_maxlayer,base_minlayer-1,-1):
        #print(list_base)
        for s in list_base: #決定誰要attention      
            list_base = []
            for j in range(12):#head數量         
                for k in range(len(token)): #token長度 被attention到的token
                    if outputs_base['attentions'][i][0][j][s][k].detach().numpy()>threshold:
                        list_base.append(k)
            set_base = set_base|set(list_base)
        list_base = list(set(list_base))
        
    set_large = set({})
    list_large = [0]
    print('end')
    for i in range(large_maxlayer,large_minlayer-1,-1):
        for s in list_large:
            list_large = []
            for j in range(16):
                for k in range(len(token)):
                    if outputs_large['attentions'][i][0][j][s][k].detach().numpy()>threshold:
                        list_large.append(k)
            set_large = set_large|(set(list_large))
        list_large = list(set(list_large))
    print(set_base,set_large)
    
    attention_list = []
    
    for i in range(len(token)):
        dict1 ={}
        dict1.setdefault('token',token[i])
        if i in set_base:
            dict1.setdefault('base_attention',1)
        else:
            dict1.setdefault('base_attention',0)
        
        if i in set_large:
            dict1.setdefault('large_attention',1)
        else:
            dict1.setdefault('large_attention',0)

        dict1.setdefault('entity',new[i]['entity'])  
       
        attention_list.append(dict1)
       

    print('Hello')
        
        
    return attention_list

def cross_head_attention(text,base_layer,large_layer,base_cluster,large_cluster,threshold):
    inputs_base = tokenizer_base(text, return_tensors="pt")
    outputs_base = model_base(**inputs_base)
    inputs_large = tokenizer_large(text, return_tensors="pt")
    outputs_large = model_large(**inputs_large)
    token = tokenizer_base.tokenize(text)
    token.insert(0,'[CLS]')
    token.append('[SEP]')
    new = classifier(text)
    new.append({'entity':'[SEP]'})
    new.insert(0,{'entity':'[CLS]'})

    list_base = []
    list_large = []
    for i in base_cluster:
        for j in range(len(token)):
            if outputs_base['attentions'][base_layer][0][i][0][j].detach().numpy()>threshold:
                list_base.append(j)
    for i in large_cluster:
        for j in range(len(token)):
            if outputs_large['attentions'][large_layer][0][i][0][j].detach().numpy()>threshold:
                list_large.append(j)
    
    set_large = set(list_large)
    set_base = set(list_base)
            
    attention_list = []
    
    for i in range(len(token)):
        dict1 ={}
        dict1.setdefault('token',token[i])
        if i in set_base:
            dict1.setdefault('base_attention',1)
        else:
            dict1.setdefault('base_attention',0)
        
        if i in set_large:
            dict1.setdefault('large_attention',1)
        else:
            dict1.setdefault('large_attention',0)


        dict1.setdefault('entity',new[i]['entity'])
      
        attention_list.append(dict1)
        
        
    return attention_list


def attention(text,base_layer,base_head,large_layer,large_head,threshold):
    
    inputs_base = tokenizer_base(text, return_tensors="pt")
    outputs_base = model_base(**inputs_base)
    inputs_large = tokenizer_large(text, return_tensors="pt")
    outputs_large = model_large(**inputs_large)
    token = tokenizer_base.tokenize(text)
    token.insert(0,'[CLS]')
    token.append('[SEP]')
    dict2 ={}
    token_list = []
    new = classifier(text)
    new.append({'entity':'[SEP]'})
    new.insert(0,{'entity':'[CLS]'})
   
    for i in range(len(token)):
        dict_token ={}
        dict_token.setdefault('token',token[i])
        if outputs_base['attentions'][base_layer][0][base_head][0][i].detach().numpy()>threshold:
            dict_token.setdefault('base_attention',1)
        else:
            dict_token.setdefault('base_attention',0)
        if outputs_large['attentions'][large_layer][0][large_head][0][i].detach().numpy()>threshold:
            dict_token.setdefault('large_attention',1)
        else:
            dict_token.setdefault('large_attention',0)

        dict_token.setdefault('entity',new[i]['entity'])
      


        token_list.append(dict_token)
    dict2.setdefault('token_attention',token_list)
    return token_list


df = pd.read_json('filter.json')

df_sim = pd.read_json('sim2.json')

with open("selfbase.json", 'r') as obj:
            selfbase = json.load(obj)

with open("selflarge.json", 'r') as obj:
            selflarge = json.load(obj)

with open("scatter.json", 'r') as obj:
            scatter = json.load(obj)


with open("attention_sum.json", 'r') as obj:
            attention_sum = json.load(obj)

with open("reorder.json", 'r') as obj:
            reorder = json.load(obj)

with open("hist.json", 'r') as obj:
    hist = json.load(obj)

app = Flask(__name__)
@app.route("/",methods=['GET','POST'])
def index():
    if request.method=='POST':
        print("get request")
        
        
        return  {'sum':attention_sum,'reorder':reorder}
             

    else:
        print("hello world")
        student = [{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]},{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]}]
        print("end")        
        return render_template('BERT.html',student=student)

@app.route("/temp",methods=['GET','POST'])
def temp():
    if request.method=='POST':
        global key

        key  = request.form['key']
        splitkey = key.split('L')
        baselayer = 'L'+splitkey[0]
        largelayer = 'L'+splitkey[1]
        print(key)
        print(type(key))
        return {'hist':hist[key],'selfbase':selfbase[baselayer],'selflarge':selflarge[largelayer],'baselayer':splitkey[0],'largelayer':splitkey[1]}
    
    else:
        print("hello world")
        student = [{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]},{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]}]
        print("end")        
        return render_template('BERT.html',student=student)

@app.route("/temp2",methods=['GET','POST'])
def temp2():
    if request.method=='POST':
        global head
        head  = request.form['head']
        print(key)
        print(head)
        label = key+'_'+head
        return {'scatter':scatter[label]}
    
    else:
        print("hello world")
        student = [{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]},{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]}]
        print("end")        
        return render_template('BERT.html',student=student)

@app.route("/temp3",methods=['GET','POST'])
def temp3():
    if request.method=='POST':
        global filter_text
        
        filter_data  = request.form['filter_data']
        filter_index  = request.form['filter_index']
        filter_text = request.form['filter_text']
        filter_index = json.loads(filter_index)
        filter_data = json.loads(filter_data)
        filter_text = json.loads(filter_text)
       
        df2 = df.loc[filter_index]
        emptylist = []
        for i in range(12):
            for j in range(24):
                emptydic = {}
                label = str(i)+'L'+str(j)
                emptydic.setdefault(label,df2[label].sum()/len(filter_index))
                emptylist.append(emptydic)
        
        global dfsim2
        dfsim2 = df_sim.loc[filter_index]
        dfsim2.reset_index(drop=True, inplace=True)
        
        z = []
        for i in range(12):
            for j in range(16):  
                dict2 ={}  
                q = []
                label = key
                label = label+'_'+str(i)+"H"+str(j)
              
                for k in range(len(filter_data)):
                    dict1 ={}
                    dict1.setdefault("values",dfsim2[label][k].astype('float64'))
                    dict1.setdefault("sentiment",dfsim2['sentiment'][k].astype('float64'))
                    q.append(dict1)
                dict2.setdefault(str(i)+"H"+str(j),q)
                dict2.setdefault('head_values',(dfsim2[label].sum()/len(filter_data)))

                z.append(dict2)

        #########################################
        threshold = float(request.form['threshold'])
        #print(chosen_text)
        splitkey = key.split('L')
        baselayer = int(splitkey[0])
        largelayer = int(splitkey[1])
        splithead = head.split('H')
        basehead = int(splithead[0])
        largehead = int(splithead[1])
        print(baselayer,largelayer,basehead,largehead)
       
        print(filter_text[0])


        color_list = []
        n = 0
        for i in filter_text:
            a = {}
            a.setdefault('sentiment',dfsim2['sentiment'][n].astype('float64'))
            a.setdefault('result_base',dfsim2['result_base'][n].astype('float64'))
            a.setdefault('result_large',dfsim2['result_large'][n].astype('float64'))
            n = n+1
            color_list.append(a)
        token_attention = []
        for i in filter_text:
            token_attention.append(attention(i,baselayer,basehead,largelayer,largehead,threshold))
                
        base_pos = []
        large_pos = []
        for i in token_attention:
            for j in i:
                if j['base_attention']==1:
                    base_pos.append(j['entity'])
                if j['large_attention']==1:
                    large_pos.append(j['entity'])
        base_large_set = list(set(base_pos).union(set(large_pos)))
        base_dict = {}
        base_large_list = []
        for i in base_large_set:
            base_dict = {}
            base_dict.setdefault('entity',i)
            base_dict.setdefault('base_value',base_pos.count(i))
            base_dict.setdefault('large_value',large_pos.count(i))
            base_large_list.append(base_dict)
       
      
        return {'filter_lsim':emptylist,'order':reorder,'filter_hsim':z,'key':key,'token_attention':token_attention,'pos':base_large_list,'color':color_list}
    
    else:
        print("hello world")
        student = [{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]},{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]}]
        print("end")        
        return render_template('BERT.html',student=student)

@app.route("/temp4",methods=['GET','POST'])
def temp4():
    if request.method=='POST':
        base_minlayer = int(request.form['base_minlayer'])
        base_maxlayer = int(request.form['base_maxlayer'])
        large_minlayer = int(request.form['large_minlayer'])
        large_maxlayer = int(request.form['large_maxlayer'])
        threshold = float(request.form['threshold'])
        color_list = []
        n = 0
        for i in filter_text:
            a = {}
            a.setdefault('sentiment',dfsim2['sentiment'][n].astype('float64'))
            a.setdefault('result_base',dfsim2['result_base'][n].astype('float64'))
            a.setdefault('result_large',dfsim2['result_large'][n].astype('float64'))
            n = n+1
            color_list.append(a)

        layer_attention = []
        for i in filter_text:
            layer_attention.append(cross_attention(i,base_minlayer,base_maxlayer,large_minlayer,large_maxlayer,threshold))

        base_pos = []
        large_pos = []
        for i in layer_attention:
            for j in i:
                if j['base_attention']==1:
                    base_pos.append(j['entity'])
                if j['large_attention']==1:
                    large_pos.append(j['entity'])
        base_large_set = list(set(base_pos).union(set(large_pos)))
        base_dict = {}
        base_large_list = []
        for i in base_large_set:
            base_dict = {}
            base_dict.setdefault('entity',i)
            base_dict.setdefault('base_value',base_pos.count(i))
            base_dict.setdefault('large_value',large_pos.count(i))
            base_large_list.append(base_dict)


        return {'layer_attention_token':layer_attention,'pos':base_large_list,'color':color_list}
    
    else:
        print("hello world")
        student = [{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]},{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]}]
        print("end")        
        return render_template('BERT.html',student=student)


@app.route("/temp5",methods=['GET','POST'])
def temp5():
    if request.method=='POST':
        base_cluster = json.loads(request.form['base_cluster'])
        large_cluster = json.loads(request.form['large_cluster'])
        base_cluster = [int(i) for i in base_cluster]
        large_cluster = [int(i) for i in large_cluster]
        splitkey = key.split('L')
        baselayer = int(splitkey[0])
        largelayer = int(splitkey[1])
        head_attention = []
        color_list = []
        threshold = float(request.form['threshold'])
        n = 0
        for i in filter_text:
            a = {}
            a.setdefault('sentiment',dfsim2['sentiment'][n].astype('float64'))
            a.setdefault('result_base',dfsim2['result_base'][n].astype('float64'))
            a.setdefault('result_large',dfsim2['result_large'][n].astype('float64'))
            n = n+1
            color_list.append(a)

        for i in filter_text:
            head_attention.append(cross_head_attention(i,baselayer,largelayer,base_cluster,large_cluster,threshold))


        base_pos = []
        large_pos = []
        for i in head_attention:
            for j in i:
                if j['base_attention']==1:
                    base_pos.append(j['entity'])
                if j['large_attention']==1:
                    large_pos.append(j['entity'])
        base_large_set = list(set(base_pos).union(set(large_pos)))
        base_dict = {}
        base_large_list = []
        for i in base_large_set:
            base_dict = {}
            base_dict.setdefault('entity',i)
            base_dict.setdefault('base_value',base_pos.count(i))
            base_dict.setdefault('large_value',large_pos.count(i))
            base_large_list.append(base_dict)

        return {'head_attention_token':head_attention,'pos':base_large_list,'color':color_list}
    
    else:
        print("hello world")
        student = [{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]},{"name":"values","values":[{"time":1,"value":2},{"time":2,"value":2}]}]
        print("end")        
        return render_template('BERT.html',student=student)





if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)



