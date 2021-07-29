getList()
getCheckboxSchool()
inputListening()
var studentList=[]

function getList() {
    $.getJSON("http://localhost:8080/student").done(function( data ) {
        studentList=data._embedded.students
        var studentTable=""
        $.each( studentList, function( key, val ) {
            studentTable+="<tr>"
            studentTable+="<td>"+val.name+"</td>"
            studentTable+="<td>"+val.surname+"</td>"
            studentTable+="<td>"+val.number+"</td>"
            studentTable+="<td>"+val.age+"</td>"
            studentTable+="<td>"+val.gpa+"</td>"
            if (val.school.name==null) {
                studentTable+="<td>"+"Kayıtlı Okul Yok"+"</td>"
            }
            studentTable+="<td>" +val.school.name+"</td>"
            studentTable+="<td><button type='button' class='btn btn-danger' onclick='deleteSchool("+key+")' >Sil</button>&nbsp&nbsp<button type='button' class='btn btn-primary' onclick='inputUpdate("+key+")' >Güncelle</button></td></tr>"
        });
        $("#table").html(studentTable)  
    })
}

function addSchool() {
    var school={name:$("#formName").val(),surname:$("#formSurname").val(),number:$("#formNumber").val(),
    age:$("#formAge").val(),gpa:$("#formGpa").val(),school:{id:$("#schoolBox").val()}}
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/student",
        data: JSON.stringify(school),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert("Başarıyla Eklendi");getList()},
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

function updateSchool() {
    id=parseInt($("#formId").val())
    var school={id:id,name:$("#formName").val(),surname:$("#formSurname").val(),number:$("#formNumber").val(),
    age:$("#formAge").val(),gpa:$("#formGpa").val(),school:{id:$("#schoolBox").val()}}
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/student/"+id,
        data: JSON.stringify(school),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert("Başarıyla Güncellendi");getList()},
        error: function(errMsg) {
            alert(errMsg);
        }
    });   
}

function saveBtnSchool() {
    if($("#formId").val()=="" || $("#formId").val()==null ){
        addSchool()
        cleanInput()
    }
    else{
        updateSchool()
        cleanInput()
    }
}

function deleteSchool(index) {
    var result=confirm("Silmek İstediğinizden Eminmisiniz?")
    if (result) {
        url=studentList[index]._links.self.href
        $.ajax({
            type: "DELETE",
            url: url, 
            success: function(data){getList()},
            error: function(errMsg) {
                alert(errMsg);
            }
        });   
    }
    else{}
}

function getCheckboxSchool() {
    $.getJSON("http://localhost:8080/school/search/acvtiveSchool").done(function(data) {
        schoolList=data._embedded.schools
        var selectBox=`<option>Seçiniz</option>`
        $.each( schoolList, function( key, val ) {
            selectBox+=`<option value=\"${val.id}\">${val.name}</option>`
        });
        $("#schoolBox").html(selectBox)
    })
}

function findAllSearch(name,surname,number,age,gpa,school) {
    $.getJSON( "http://localhost:8080/student/search/findAllSearch?name="+name+"&surname="+surname+"&number="+number+"&age="+age+"&gpa="+gpa+"&schoolName="+school).done(function( data ) {
        student=data._embedded.students
        var data=""
        if (school.lenght==0) {
            getlist()
        }
        $.each( student, function( key, val ) {
            data+="<tr>"
            data+="<td>"+val.name+"</td>"
            data+="<td>"+val.surname+"</td>"
            data+="<td>"+val.number+"</td>"
            data+="<td>"+val.age+"</td>"
            data+="<td>"+val.gpa+"</td>"
            data+="<td>"+val.school.name+"</td>"
            data+="<td><button type='button' class='btn btn-danger' onclick='deleteSchool("+key+")' >Sil</button>&nbsp&nbsp<button type='button' class='btn btn-primary' onclick='inputUpdate("+key+")' >Güncelle</button></td></tr>"   
            
        });
        $("#table").html(data)  
    })
}

function inputListening() {
    var name = $("#searchName").val()
    var surname = $("#searchSurname").val()
    var number = $("#searchNumber").val()
    var age = $("#searchAge").val()
    var gpa = $("#searchGpa").val()
    var school = $("#searchSchool").val()
    findAllSearch(name,surname,number,age,gpa,school)
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