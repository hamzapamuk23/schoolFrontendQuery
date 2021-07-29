getlist()
inputListening()

let schoolList=[]
function getlist() {
    $.getJSON( "http://localhost:8080/school").done(function( data ) {
        schoolList=data._embedded.schools
        var data=""
        $.each( schoolList, function( key, val ) {
            data+="<tr>"
            data+="<td>"+val.name+"</td>"
            data+="<td>"+val.code+"</td>"
            data+="<td>"+val.active+"</td>"
            data+="<td><button type='button' class='btn btn-danger' onclick='deleteSchool("+key+")' >Sil</button>&nbsp&nbsp<button type='button' class='btn btn-primary' onclick='inputUpdate("+key+")' >Güncelle</button></td></tr>"   
            
        });
        $("#table").html(data)  
    })
}

function addSchool() {
    var school={name:$("#formName").val(),code:$("#formCode").val(),active:$("#formActive")[0].checked}
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/school",
        data: JSON.stringify(school),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert("Başarıyla Eklendi");getlist()},
        error: function(errMsg) {
            alert(errMsg);
        }
    });   
}

function updateSchool() {
    id=parseInt($("#formId").val())
    var school={id:id,name:$("#formName").val(),code:$("#formCode").val(),active:$("#formActive")[0].checked}
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/school/"+id,
        data: JSON.stringify(school),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){alert("Başarıyla Güncellendi");getlist()},
        error: function(errMsg) {
            alert(errMsg);
        }
    });   
}

function inputUpdate(index) {
    $("#formId").val(schoolList[index].id)
    $("#formName").val(schoolList[index].name)
    $("#formCode").val(schoolList[index].code)
    
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
        url=schoolList[index]._links.school.href
        $.ajax({
            type: "DELETE",
            url: url,
            success: function(data){getlist()},
            error: function(errMsg) {
                alert(errMsg);
            }
        });   
    }
    else{}
}

function getNameBySchool(name,code) {
    $.getJSON( "http://localhost:8080/school/search/findBySchoolName?name="+name+"&code="+code).done(function( data ) {
        school=data._embedded.schools
        var data=""
        if (school.lenght===0) {
            getlist()
        }
        $.each( school, function( key, val ) {
            data+="<tr>"
            data+="<td>"+val.name+"</td>"
            data+="<td>"+val.code+"</td>"
            data+="<td>"+val.active+"</td>"
            data+="<td><button type='button' class='btn btn-danger' onclick='deleteSchool("+key+")' >Sil</button>&nbsp&nbsp<button type='button' class='btn btn-primary' onclick='inputUpdate("+key+")' >Güncelle</button></td></tr>"   
            
        });
        $("#table").html(data)  
    })
}

function inputListening() {
    var code = $("#searchCode").val()
    var name = $("#searchName").val()
    getNameBySchool(name,code)
}

function cleanInput(){
    $("#formId").val("")
    $("#formName").val("")
    $("#formCode").val("") 
}

$("#form").submit(function(e) {
    e.preventDefault();
})
