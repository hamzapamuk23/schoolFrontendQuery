var studentList=[]
var studentObj = {name: '', surname: '', number:'', age:'', gpa:'', school: ''}
getListStudent()
getCheckboxSchool()

function getListStudent() {
    
    $.getJSON("http://localhost:8080/student/search/findAllSearch?name="+studentObj.name+"&surname="+studentObj.surname+"&number="+studentObj.number+"&age="+studentObj.age+"&gpa="+studentObj.gpa+"&schoolName="+studentObj.school).done(function( data ) {
        studentList=data._embedded.students
        var studentTable=""
        $.each( studentList, function( key, val ) {
            studentTable+="<tr>"
            studentTable+="<td>"+val.name+"</td>"
            studentTable+="<td>"+val.surname+"</td>"
            studentTable+="<td>"+val.number+"</td>"
            studentTable+="<td>"+val.age+"</td>"
            studentTable+="<td>"+val.gpa+"</td>"
            if (val.school==null) {studentTable+="<td></td>"}
            else{studentTable+="<td>" +val.school.name+"</td>"}
            studentTable+="<td><button type='button' class='btn btn-danger' onclick='deleteStudent("+key+")' >Sil</button>&nbsp&nbsp<button type='button' class='btn btn-primary' onclick='inputUpdate("+key+")' >Güncelle</button></td></tr>"
        });
        $("#table").html(studentTable)  
    })
}

function addStudent() {
    var student={name:$("#formName").val(),surname:$("#formSurname").val(),number:$("#formNumber").val(),
    age:$("#formAge").val(),gpa:$("#formGpa").val(),school:{id:$("#schoolBox").val()}}
    if($("#schoolBox").val()=="Seçiniz"){
        var student={name:$("#formName").val(),surname:$("#formSurname").val(),number:$("#formNumber").val(),
    age:$("#formAge").val(),gpa:$("#formGpa").val()}
    }
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/student",
        data: JSON.stringify(student),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert("Başarıyla Eklendi");getListStudent()},
        error: function(errMsg) {
            alert(errMsg);
        }
    });   
}

function inputUpdate(index) {
    $("#formId").val(studentList[index].id)
    $("#formSurname").val(studentList[index].surname)
    $("#formName").val(studentList[index].name)
    $("#formNumber").val(studentList[index].number)
    $("#formAge").val(studentList[index].age)
    $("#formGpa").val(studentList[index].gpa)
    schoolIndex = ( schoolList.findIndex(school => school.id === studentList[index].school.id) + 1)
    $("#schoolBox")[0].selectedIndex = schoolIndex
}

function updateStudent() {
    id=parseInt($("#formId").val())
    var student={id:id,name:$("#formName").val(),surname:$("#formSurname").val(),number:$("#formNumber").val(),
    age:$("#formAge").val(),gpa:$("#formGpa").val(),school:{id:$("#schoolBox").val()}}
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/student/"+id,
        data: JSON.stringify(student),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert("Başarıyla Güncellendi");getListStudent()},
        error: function(errMsg) {
            alert(errMsg);
        }
    });   
}

function saveBtnStudent() {
    if($("#formId").val()=="" || $("#formId").val()==null ){
        addStudent()
        cleanInput()
    }
    else{
        updateStudent()
        cleanInput()
    }
}

function deleteStudent(index) {
    var result=confirm("Silmek İstediğinizden Eminmisiniz?")
    if (result) {
        url=studentList[index]._links.self.href
        $.ajax({
            type: "DELETE",
            url: url, 
            success: function(data){getListStudent()},
            error: function(errMsg) {
                alert(errMsg);
            }
        });   
    }
    else{}
}

function getCheckboxSchool() {
    $.getJSON("http://localhost:8080/school/search/findByActiveTrue").done(function(data) {
        schoolList=data._embedded.schools
        var selectBox=`<option>Seçiniz</option>`
        $.each( schoolList, function( key, val ) {
            selectBox+=`<option value=\"${val.id}\">${val.name}</option>`
        });
        $("#schoolBox").html(selectBox)
    })
}
function inputListening() {
    studentObj = {name: $("#searchName").val(), surname: $("#searchSurname").val(), number:$("#searchNumber").val(), age:$("#searchAge").val(), gpa: $("#searchGpa").val(), school: $("#searchSchool").val()}
    getListStudent()
}

function cleanInput(){
    $("#formId").val("")
    $("#formName").val("")
    $("#formSurname").val("")
    $("#formNumber").val("")
    $("#formAge").val("")
    $("#formGpa").val("")
    $("#schoolBox")[0].selectedIndex = 0
}

$("#form").submit(function(e) {
    e.preventDefault();
})