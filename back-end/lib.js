
const isEnrolled = (user,course_id)=>{
    const searchRes = user.courses.find(elem=>elem.course_id === course_id);
    if(searchRes === undefined){
        return {'isEnrolled':false,'courseName':null};
    }
    return {'isEnrolled':true,'courseName':searchRes['course_name']};
};

const postCreateCourseFieldCheck = (user,req) =>{
    return user.role==='Instructor'&&req.body && req.body.course_name && req.body.term
};

const postLoginFieldCheck = (req)=>{
    return req.body && req.body.email && req.body.password;
};

const getAutherNameAndSetMode = (course,reply,user) =>{
    const ins_mode = isInstructor(course,user);
    let author_name = reply.author;
    if(ins_mode && reply.author === 'Anonymous to Classmates'){
        author_name += " (" + reply.firstname + " " + reply.lastname + ")";
    }
    else if(reply.uid===user.uid){
        author_name += " (me)"
    }
    return [author_name,ins_mode];
};

const hasVoted = (reply,user) =>{
  return reply.voter_uid.indexOf(user.uid) !== -1
};

const voterIndex = (reply,user)=>{
    return reply.voter_uid.indexOf(user.uid);
};

const removeVoterUid = (reply,index) =>{
    reply.voter_uid.splice(index,1);
};

const replyPostFieldCheck = (req)=>{
    return !req.body||!req.body.reply||!req.body.post_as;
};

const isInstructor = (course,user)=>{
    return course.instructor_uids.indexOf(user.uid)!==-1;
};

const getReplyPostAuthorName = (req,user,is_official_ans) =>{
    return is_official_ans? req.body.post_as: user.firstname + " " + user.lastname;
};

const generatePostPreview = (post) =>{
    let preview = post.content.replace(/(\r\n|\n|\r|\t)/gm, "");
    if(preview.length > 122){
        preview = preview.slice(0,122);
    }
    return preview;
};



module.exports = {
    isEnrolled: isEnrolled,
    postCreateCourseFieldCheck:postCreateCourseFieldCheck,
    postLoginFieldCheck:postLoginFieldCheck,
    getAutherNameAndSetMode:getAutherNameAndSetMode,
    hasVoted:hasVoted,
    voterIndex:voterIndex,
    removeVoterUid:removeVoterUid,
    replyPostFieldCheck:replyPostFieldCheck,
    isInstructor:isInstructor,
    getReplyPostAuthorName:getReplyPostAuthorName,
    generatePostPreview:generatePostPreview,
};
