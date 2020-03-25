
from flask import Flask, request,render_template,redirect,url_for,flash,abort
from flask_cors import CORS
import os
# import pymongo



# initializing flask
app = Flask(__name__)


# prevent cross site request forgery
cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:3000","http://127.0.0.1:3000"]}})
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY


# database setup (mongodb)
# myclient = pymongo.MongoClient('mongodb://localhost:27017/')
# mydb = myclient['test']
# user_collection = mydb['user']

@app.route("/<courseId>/Forum/<postId>/post/<reply_id>/DeleteReply",methods=["DELETE"])
def deletePostReply(courseId,postId,reply_id):
    return {'deleteSuccess':True}

@app.route("/<courseId>/Forum/<postId>/post/ReplyPost",methods=["GET","POST"])
def replyPost(courseId,postId):
    if request.method == 'GET':
        return {
            'postid': 1,
            'topic': "No graphs in output file?",
            'content': "I just got done with my job, and it does not look like the output file contains any graphs? \nOnly thing on there are my print statements.",
            "resolved": True,
            'replies': 2,
            "time": 1574313620213,
            "author": "Allan",
            "authorId": 2422,
        }
    print(request)
    return {'postSuccess':True}

@app.route("/<courseId>/Forum/<postId>/post",methods=["GET"])
def getPost(courseId,postId):
    return {
        'postid': 1,
        'topic': "No graphs in output file?",
        'content': "I just got done with my job, and it does not look like the output file contains any graphs? \nOnly thing on there are my print statements.",
        "resolved": True,
        'replies': 2,
        "time": 1574313620213,
        "author": "Allan",
        "authorId": 2422,
        'reply_details':[
            {
                "has_voted": False,
                "reply_id": 101,
                "author":"Zeping Zhan",
                "authorId":310,
                "is_official_ans": True,
                "time":1584329621216,
                "up_vote":8,
                "content":"It's essentially just a text file so you need to save the plot as a file."
             },
            {
                "has_voted": True,
                "reply_id": 132,
                "author": "James",
                "authorId": 201,
                "is_official_ans": False,
                "time": 1580300621000,
                "up_vote": 23,
                "content": "Try savefig() function",
            },
            {
                "has_voted": False,
                "reply_id": 210,
                "author":"Anonymous",
                "authorId": 472,
                "is_official_ans":False,
                "time": 1575300621000,
                "up_vote": 1,
                "content":"you should ask NYU hpc"
            },
        ],
    }

@app.route("/<courseId>/Forum",methods=["GET"])
def getListOfPosts(courseId):
    return {
        'CourseName': 'CS480 Computer Vision',
        'ListOfPosts': [
            {
                'topic': 'No graphs in output file?',
                'preview': 'I just got done with my job, and it does not look like the output file contains any graphs? Only thing on there are my pr',
                'resolved': False,
                'postid': 1,
                'replies': 2
            },
            {
                'topic': 'Understanding Learning Rate',
                'preview': "I'm plotting accuracy and loss curves for each learning rate, and my graphs look a little unexpected (I might be nai",
                'resolved': False,
                'postid': 2,
                'replies': 0
            },
            {
                'topic': 'Prince Cluster Modules to Load',
                'preview': "I've been getting erros with my python imports using the prince cluster for over an hour now. And at this point I am",
                'resolved': True,
                'postid': 3,
                'replies': 2

            },
            {
                'topic': 'How to calculate loss for an epoch',
                'preview': "One thing I am a little confused about is how to calculate the loss for each epoch. I calculate the loss on each sample",
                'resolved': True,
                'postid': 4,
                'replies': 1

            },
            {
                'topic': "Clarification on part two's three different sets of hyperparameters",
                'preview': "What does it mean by three sets of hyperparameters? If I choose three learning rate e.g. 0.5, 0.05 and 0.005, would this",
                'resolved': True,
                'postid': 5,
                'replies': 3

            },
            {
                'topic': 'How to plot all learning rates on one plot',
                'preview': "I've been getting erros with my python imports using the prince cluster for over an hour now. And at this point I am",
                'resolved': True,
                'postid': 6,
                'replies': 4
            },

        ],
    }

@app.route("/<int:courseId>/Syllabus",methods=["GET","POST"])
def getSyllabus(courseId):
    if request.method == 'GET':
        return {
            'courseId': courseId,
            'courseName': 'CS480 Computer Vision',
            'syllabus': 'Here is the class\'s syllabus returned from the back-end',
            'success': True
        }
    elif request.method == 'POST':
        return{
            'courseId': courseId,
            'courseName': 'CS480 Computer Vision',
            'syllabus': 'Here is the class\'s updated syllabus',
            'success': True
        }
    else:
        print(request)
        print("Invalid request for route")
        return{
            'courseId': courseId,
            'courseName': 'CS480 Computer Vision',
            'syllabus': null,
            'success': False
        }

if __name__ == "__main__":
    app.run()