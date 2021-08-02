let schoolList=[]
var schoolObj = {name: '', code: '', active: false}
var options = {size: 2, totalElements:0, totalPages:0}
var page = 0
getSchoolList()
function getSchoolList() {
    $.getJSON( "http://localhost:8080/school/search/findBySchoolName?name="+schoolObj.name+"&code="+schoolObj.code + "&size=" + options.size +"&page=" + page ).done(function( data ) {
        options = data.page    
        schoolList=data._embedded.schools
            var dataTable=""
            $.each( schoolList, function( key, val ) {
                dataTable+="<tr>"
                dataTable+="<td>"+val.name+"</td>"
                dataTable+="<td>"+val.code+"</td>"
                dataTable+="<td>"+val.active+"</td>"
                dataTable+="<td><button type='button' class='btn btn-danger' onclick='deleteSchool("+val.id+")' >Sil</button>&nbsp&nbsp<button type='button' class='btn btn-primary' onclick='inputUpdate("+key+")' >Güncelle</button></td></tr>"   
                
            });
            $("#table").html(dataTable)
    })
    
}

function addSchool() {
    school={name:$("#formName").val(),code:$("#formCode").val(),active:$("#formActive")[0].checked}
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/school",
        data: JSON.stringify(school),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            alert("Başarıyla Eklendi")
            getSchoolList()
        },
        error: function(errMsg) {
            alert(errMsg);
        }
    });   
}

function updateSchool() {
    school={id:parseInt($("#formId").val()),name:$("#formName").val(),code:$("#formCode").val(),active:$("#formActive")[0].checked}
    $.ajax({
        type: "PUT",
        url: "http://localhost:8080/school/"+school.id,
        data: JSON.stringify(school),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            alert("Başarıyla Güncellendi")
            getSchoolList()
        },
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

function deleteSchool(id) {
    var result=confirm("Silmek İstediğinizden Eminmisiniz?")
    if (result) {
        url="http://localhost:8080/school/"+id
        $.ajax({
            type: "DELETE",
            url: url,
            success: function(data){
                getSchoolList()
                cleanInput()
            },
            error: function(errMsg) {
                alert(errMsg);
            }
        });   
    }
    else{}
}

function inputListening() {
    schoolObj = {name:$("#searchName").val(), code:$("#searchCode").val()}
    getSchoolList()
}

function cleanInput(){
    $("#formId").val("")
    $("#formName").val("")
    $("#formCode").val("") 
}

function changePage(event){
    if(event.path[0].id === 'nextBtn' && page < options.totalPages -1) page++
    else if(event.path[0].id === 'prevBtn' && page > 0) page--
    getSchoolList()
}

$("#form").submit(function(e) {
    e.preventDefault();
})