window.onload = function(){
    //fillJobs()
    windowHeight = ($(window).height() - 58);
    $("#createFormContainer").css(`height`, `${windowHeight}px`)
    $("#searchFormContainer").css(`height`, `${windowHeight}px`)
    $("#entryFormContainer").css(`height`, `${windowHeight}px`)
    $("#entry").hide()
    $("#create").hide() 
    fillLocations()
    fillDepartments()
    fillAutoComplete()
    
    $(document).click(function (event) {
        hideAlert();
    });
}

function goBackToResults(){
    $("#search").hide()
    $("#create").hide()
    $("#entry").hide()
    $("#searchResults").show()
}

function fillAutoComplete(){
        $('.basicAutoComplete').autoComplete({
            preventEnter: true,
            minLength:0,
            resolverSettings: {
                url: '../CompanyDirectory/departments.json'
            }
        });
}

function fillJobs(){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'fillJobs'},
        success: (obj)=>{console.log("JOBS FILLED "+obj)},
        error: (er)=>{console.log(er.responseText)}
        
    })

}

function clearSearch(){
    $('#searchForm').trigger("reset");
}

function clearCreate(){
    $('#createForm').trigger("reset");
    $('#firstNameCreate').removeClass("border-danger")
    $('#firstNameCreate').removeClass("border-success")

    $('#lastNameCreate').removeClass("border-danger")
    $('#lastNameCreate').removeClass("border-success")
    
    $('#emailCreate').removeClass("border-danger")
    $('#emailCreate').removeClass("border-success")

    $('#jobTitleCreate').removeClass("border-danger")
    $('#jobTitleCreate').removeClass("border-success")
    
    $('#idCreate').removeClass("border-danger")
    $('#idCreate').removeClass("border-success")
}

function createClicked(){
    $("#resultList").empty()
    $("#searchResults").hide()
    $("#entry").hide()
    $("#create").show()
    $("#create").css("display: flex")
    $("#search").hide();
    $("#searchTab").addClass("text-light");
    $("#searchTab").removeClass("active");
    $("#createTab").removeClass("text-light");
    $("#createTab").addClass("active");
    $("#createTabCheck").text("(current)")
    $("#searchTabCheck").text("")

    $(".form-control").removeClass("border-danger")
    $(".form-control").removeClass("border-success")
    $('#createForm').trigger("reset");
}


function searchClicked(){
    $("#resultList").empty()
    $("#searchResults").hide()
    $("#entry").hide()
    $("#create").hide()
    $("#createTab").removeClass("active");
    $("#createTab").addClass("text-light");
    $("#search").show()
    $("#searchTab").addClass("active");
    $("#searchTab").removeClass("text-light");
    $("#searchTabCheck").text("(current)")
    $("#createTabCheck").text("")
    $('#searchForm').trigger("reset");


}

function showAlert(){
    $("#collapseAlert").collapse("show")
    setTimeout(hideAlert,5000)

}

function hideAlert(){
    $("#collapseAlert").collapse("hide")
}

function getLocationFromDepartment(depID){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getLocationFromDepartment', arguments: [depID]},
        success: (ob)=>{console.log(ob)},
        error: (er)=>{console.log(er.responseText)}
    })
}

function submitSearch(){
    $("#recordOutput").empty();
    obj = {};
    obj.firstName = $("#firstNameSearch").val()
    obj.lastName = $("#lastNameSearch").val()
    obj.email = $("#emailSearch").val()
    obj.id = $("#idSearch").val()
    if (Number(obj.id) == NaN){
        $("idSearch").addClass("border-danger")
        return false;
    }
    obj.location = $("#locationSearch").val()
    obj.department = $("#departmentSearch").val()
    obj.jobTitle = $("#jobTitleSearch").val()
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'search', arguments: [obj]},
        success: showResults,
        error: (er)=>{
            showAlert();
            $("#alertText").text("No Results")
            $("#alertText").addClass("bg-warning")
        }
        
    })

}

function entryClicked(id){
    
    $("#backButton").removeAttr("onclick")
    $("#backButton").attr("onclick", "goBackToResults()")
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getPersonByID', arguments: [id]},
        success: displayEntry,
        error: (er)=>{console.log(er.responseText)}
    })
    
}

function displayEntry(person){
    $("#searchResults").hide()
    $("#entry").show()
    $("#create").hide()
    $("#search").hide()
    $("#firstNameEntry").text(person.firstName)
    $("#firstNameShow").removeClass("d-none")
    $("#firstNameShow").addClass("d-flex")
    $("#firstNameInput").val(person.firstName)
    $("#firstNameInput").addClass("d-none")
    
    $("#firstNamePen").removeClass("d-none");
    $("#firstNameTick").addClass("d-none");
    $("#firstNameTick").removeAttr("onclick");
    $("#firstNameTick").attr("onclick",`updateSingleCol(${person.id},"firstName")`);

    $("#lastNameEntry").text(person.lastName)
    $("#lastNameShow").removeClass("d-none")
    $("#lastNameShow").addClass("d-flex")
    $("#lastNameInput").val(person.lastName)
    $("#lastNameInput").addClass("d-none")
    
    $("#lastNamePen").removeClass("d-none");
    $("#lastNameTick").addClass("d-none");
    $("#lastNameTick").removeAttr("onclick");
    $("#lastNameTick").attr("onclick",`updateSingleCol(${person.id},"lastName")`);

    $("#idEntry").text(person.id)
    $("#idShow").removeClass("d-none")
    $("#idShow").addClass("d-flex")
    $("#idInput").val(person.id)
    $("#idInput").addClass("d-none")
    $("#idGenInput").addClass("d-none")

    $("#idPen").removeClass("d-none");
    $("#idTick").addClass("d-none");
    $("#idTick").removeAttr("onclick");
    $("#idTick").attr("onclick",`updateSingleCol(${person.id},"id")`);

    $("#emailEntry").text(person.email)
    $("#emailShow").removeClass("d-none")
    $("#emailShow").addClass("d-flex")
    $("#emailInput").val(person.email)
    $("#emailInput").addClass("d-none")

    $("#emailPen").removeClass("d-none");
    $("#emailTick").addClass("d-none");
    $("#emailTick").removeAttr("onclick");
    $("#emailTick").attr("onclick",`updateSingleCol(${person.id},"email")`);

    $("#departmentEntry").text(person.departmentName)
    $("#departmentShow").removeClass("d-none")
    $("#departmentShow").addClass("d-flex")
    $("#departmentInput").val(person.departmentID)
    $("#departmentInput").addClass("d-none")
    $("#entryDepHead").text(person.departmentHead)
    $("#entryDepHead").attr('onclick',`entryClicked(${person.departmentHeadID})`)
    
    $("#departmentPen").removeClass("d-none");
    $("#departmentTick").addClass("d-none");
    $("#departmentTick").removeAttr("onclick");
    $("#departmentTick").attr("onclick",`updateSingleCol(${person.id},"departmentID")`);

    
    $("#jobTitleEntry").text(person.jobTitle)
    $("#jobTitleShow").removeClass("d-none")
    $("#jobTitleShow").addClass("d-flex")
    $("#jobTitleInput").val(person.jobTitle)
    $("#jobTitleInput").addClass("d-none")
    
    $("#jobTitlePen").removeClass("d-none");
    $("#jobTitleTick").addClass("d-none");
    $("#jobTitleTick").removeAttr("onclick");
    $("#jobTitleTick").attr("onclick",`updateSingleCol(${person.id},"jobTitle")`);

    $("#departmentShow").removeClass("d-none")
    $("#departmentShow").addClass("d-flex")
    $("#departmentInput").val(person.departmentID)
    $("#departmentInput").addClass("d-none")

    $("#deleteName").text(person.firstName+" "+person.lastName)
    $("#deleteSecondButton").removeAttr("onclick");
    $("#saveButton").removeAttr("onclick");
    $("#deleteSecondButton").attr("onclick", `deleteEntry(${person.id})`)
    $("#saveButton").attr("onclick", `saveEntry(${person.id})`)
 
}

function deleteEntry(id){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'deleteEntry', arguments: [id]},
        success: (obj)=>{
            searchClicked()
            showAlert()
            $("#alertText").removeClass("bg-warning")
            $("#alertText").removeClass("bg-success")
            $("#alertText").text("Entry Deleted")
            $("#alertText").addClass("bg-danger")

        },
        error: (err)=>{console.log(err.responseText)}
    })
}

function saveEntry(id){
    person = {}
    person.id = $("#idInput").val()
    
    console.log("InputVal "+person.id)
    console.log("CurVal "+id)

    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'checkID', arguments: [person.id]},
        success: (obj)=>{
            console.log(obj)
            if (obj == 'false' || person.id == id){
                person.firstName = $("#firstNameInput").val()
                person.lastName = $("#lastNameInput").val()
                person.email = $("#emailInput").val()
                person.jobTitle = $("#jobTitleInput").val()
                person.departmentID = $("#departmentInput option:selected").val()
                console.log("OLD ID: "+id)
                console.log("NEW ID: "+person.id)
                
                updatePerson(person,id)

            } else{                
                showAlert()
                $("#alertText").text("ID in use")
                $("#alertText").removeClass("bg-warning")
                $("#alertText").removeClass("bg-success")
                $("#alertText").addClass("bg-danger")
            }

        },
        error: (err)=>{console.log(err.responseText)}
    })
    
    


    


}

function updatePerson(person,id){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateAll', arguments: [person,id]},
        success: (obj)=>{
            showAlert()
            $("#alertText").removeClass("bg-warning")
            $("#alertText").removeClass("bg-danger")
            $("#alertText").addClass("bg-success")
            $("#alertText").text("Record Succesfully Updated")
            searchClicked();
        },
        error: (err)=>{console.log(err.responseText)}
    })
}

function editEntry(elem){
    if (elem == "id"){
        $("#idGenInput").removeClass("d-none")
    }
    $(`#${elem}Pen`).addClass("d-none")
    $(`#${elem}Tick`).removeClass("d-none")
    $(`#${elem}Input`).removeClass("d-none")
    $(`#${elem}Show`).removeClass("d-flex")
    $(`#${elem}Show`).addClass("d-none")
}

function updateSingleCol(id, elem){
    
    val = $(`#${elem}Input`).val()
    if (elem=="id" && val == id){
        $(`#${elem}Entry`).text($(`#${elem}Input`).val())
            $(`#${elem}Show`).removeClass("d-none")
            $(`#${elem}Pen`).removeClass("d-none")
            $(`#${elem}Tick`).addClass("d-none")
            $(`#${elem}Input`).addClass("d-none")
            $(`#${elem}GenInput`).addClass("d-none")
            return;
    }
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateDetails', arguments: [elem,val,id]},
        success: (obj)=>{
            if (obj == "invalid id"){
            showAlert()
            $("#alertText").text("ID is already in use")
            $("#alertText").removeClass("bg-success")
            $("#alertText").removeClass("bg-warning")
            $("#alertText").addClass("bg-danger")
            } else {
            $(`#${elem}Entry`).text($(`#${elem}Input`).val())
            $(`#${elem}Show`).removeClass("d-none")
            $(`#${elem}Pen`).removeClass("d-none")
            $(`#${elem}Tick`).addClass("d-none")
            $(`#${elem}GenInput`).addClass("d-none")
            $(`#${elem}Input`).addClass("d-none")
            }
        },
        error: (err)=>{
            showAlert()
            $("#alertText").text("ID is already in use")
            $("#alertText").removeClass("bg-success")
            $("#alertText").removeClass("bg-warning")
            $("#alertText").addClass("bg-danger")
        }
    })
}

function updateID(id){
    data = $("#idInput").val()
    elem = "id"
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateDetails', arguments: [elem,data,id]},
        success: (obj)=>{
            $(`#${elem}Display`).text(`${obj[0]}`)                
            $(`#${elem}Edit`).addClass("d-none")
            $(`#${elem}Record`).show()
            $(`#${elem}Record`).addClass("d-flex")
        },
        error: (err)=>{
            showAlert();
            $("#alertText").text("ID already in use")
            $("#alertText").addClass("bg-warning");
            $("#alertText").removeClass("bg-danger");
            $("#alertText").removeClass("bg-success");
        }
    })

}

function updateEmail(id){
    data = $("#emailInput").val()
    elem = "email"
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateDetails', arguments: [elem,data,id]},
        success: (obj)=>{
            $(`#${elem}Display`).text(`${obj[0]}`)                
            $(`#${elem}Edit`).addClass("d-none")
            $(`#${elem}Record`).show()
            $(`#${elem}Record`).addClass("d-flex")
        },
        error: (err)=>{console.log(err.responseText)}
    })

}

function updatejobTitle(id){
    data = $("#jobTitleInput").val()
    elem = "jobTitle"
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateDetails', arguments: [elem,data,id]},
        success: (obj)=>{
            $(`#${elem}Display`).text(`${obj[0]}`)                
            $(`#${elem}Edit`).addClass("d-none")
            $(`#${elem}Record`).show()
            $(`#${elem}Record`).addClass("d-flex")
        },
        error: (err)=>{console.log(err.responseText)}
    })

}

function updateDepartment(id){
    data = $("#departmentInput").val()
    elem = "departmentID"
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateDetails', arguments: [elem,data,id]},
        success: (obj)=>{
            updateLocation(obj[0])
            $(`#departmentDisplay`).text($("#departmentInput option:selected").text())                
            $(`#departmentEdit`).addClass("d-none")
            $(`#departmentRecord`).show()
            $(`#departmentRecord`).addClass("d-flex")
        },
        error: (err)=>{console.log(err.responseText)}
    })
}

function updateLocation(departmentID){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getLocationFromDepartment', arguments: [departmentID]},
        success: (obj)=>{
            $(`#locationDisplay`).text(obj)
        },
        error: (err)=>{console.log(err.responseText)}
    })

}

function showResults(res){
    clearSearch()
    $("#entry").hide()
    

    $("#search").hide()
    $("#searchResults").show()

    i=0;
    res.forEach(function(record){
        if (i%2==0){
            recordHTML = `<li class="list-group-item bg-light h-10">`
        } else {
            recordHTML = `<li class="list-group-item bg-grey h-10">`
        }
        recordHTML += `
        <h4>${record.firstName} ${record.lastName}</h4>
        <h5>${record.email}</h5>
        <div class="row">
            <div class="col">
                ID:${record.id}
            </div>
            <div class="col">
            ${record.jobTitle}
            </div>
      </div>
      <div class="row">
        <div class="col">
                ${record.locationName}
            </div>
            <div class="col">
             ${record.departmentName} (<i>${record.departmentHead}</i>)
            </div>
        </div>
        <a href="#" onclick="entryClicked(${record.id})" class="stretched-link"></a>
        </li>`



        $("#resultList").append(recordHTML)
        i++;
    })
}

function fillLocations(){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getLocations'},
        success: (obje)=>{
            obje.forEach(function(location){
                option = document.createElement("option") 
                option.value = location.id;
                option.text = location.name;
                $('#locationSearch').append(option)
            })
        },
        error: (er)=>{console.log(er)}
        
    })
}

function fillDepartments(){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getDepartments'},
        success: (obje)=>{
            obje.forEach(function(department){
                option = document.createElement("option")
                option.value = department.id;
                option.text = department.name;
                $('#departmentSearch').append(option)

                option2 = document.createElement("option")
                option2.value = department.id;
                option2.text = department.name;
                $('#departmentCreate').append(option2)

                option3 = document.createElement("option")
                option3.value = department.id;
                option3.text = department.name;
                $('#departmentInput').append(option3)



                
                

                

            })
        },
        error: (er)=>{console.log(er)}
        
    })
}



function checkEmail(elem){
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    elem.classList.remove("bg-success")    
    elem.classList.remove("bg-danger")
    console.log(emailRegex.test(elem.value))
    if (!elem.value || !emailRegex.test(elem.value)){
        elem.classList.remove("border-success")
        elem.classList.add("border-danger")
    } else {
        elem.classList.remove("border-danger")
        elem.classList.add("border-success")
    }
    
}

function checkEmpty(elem){
    elem.classList.remove("border-success")    
    elem.classList.remove("border-danger")
    if (!elem.value){
        elem.classList.add("border-danger")
    } else {
        elem.classList.add("border-success")
    }
}

function submitCreate(){
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    obj = {};
    obj.id = $("#idCreate").val()
    obj.firstName = $("#firstNameCreate").val()
    obj.lastName = $("#lastNameCreate").val()
    obj.email = $("#emailCreate").val()
    obj.departmentID = $("#departmentCreate").val()
    obj.departmentName = $("#departmentCreate option:selected").text()
    obj.jobTitle = $("#jobTitleCreate").val()
    errArr=[]
    if (obj.firstName==""){
        errArr.push("Must Enter First Name")
        $("#firstNameCreate").addClass("border-danger")
        $("#firstNameCreate").removeClass("border-success")
    }
    if (obj.lastName==""){
        errArr.push("Must Enter Last Name")
        $("#lastNameCreate").addClass("border-danger")
        $("#lastNameCreate").removeClass("border-success")
    } 
    if (obj.email=="" || (emailRegex.test(obj.email) == false)){
        errArr.push("Must enter valid email")
        $("#emailCreate").addClass("border-danger")
        $("#emailCreate").removeClass("border-success")
    } 
    if (obj.departmentID == ""){
        errArr.push("Must choose a department")
        $("#departmentCreate").addClass("border-danger")
        $("#departmentCreate").removeClass("border-success")
    } 


    if(errArr.length > 0){
        $("#alertText").text(errArr.join(" / "))
        $("#alertText").addClass("bg-warning")
        showAlert()
        return
    }

    $("#backButton").removeAttr("onclick")
    $("#backButton").attr("onclick", "createClicked()")
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'create', arguments: [obj]},
        success: (obj)=>{
            if (obj != "ID or Email already in use"){
            displayEntry(obj)
            showAlert()
            $("#alertText").text("Entry Created")
            $("#alertText").removeClass("bg-warning")
            $("#alertText").removeClass("bg-danger")
            $("#alertText").addClass("bg-success")
            } else {
                createClicked()
                showAlert()
                $("#alertText").text("ID or Email already in use")
                $("#alertText").removeClass("bg-success")
                $("#alertText").removeClass("bg-danger")
                $("#alertText").addClass("bg-warning")
            }
        },
        error: (er)=>{console.log(er.responseText)}
        
    })

}

function checkID(elem){
    if (elem == undefined){
        $("#idCreate").removeClass("border-danger")
        $("#idCreate").removeClass("border-success")
        return
    }
    id=elem.value
    if (!id){
        elem.classList.remove("border-success")
        if (elem=="Search"){
            elem.classList.remove("border-danger")
        }
        return
    }
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'checkID', arguments: [id]},
        success: (obje)=>{
            if(elem.id=="idSearch"){
                if (obje == "false"){
                    elem.classList.add("border-danger")
                    elem.classList.remove("border-success")
                } else {
                    elem.classList.add("border-success")
                    elem.classList.remove("border-danger")
                }
            } else if(elem.id=="idCreate" || elem.id=="idInput"){
                if (obje == "true"){
                    elem.classList.add("border-danger")
                    elem.classList.remove("border-success")
                } else {
                    elem.classList.add("border-success")
                    elem.classList.remove("border-danger")
                }
            }
            
        },
        error: (err)=>{console.log(err.responseText)}
    })
    
}

function fillID(loc){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getAvailableIDs'},
        success: (obje)=>{
            ranNum = Math.floor(Math.random()*10)
            $(`#id${loc}`).val(obje[ranNum])
            $(`#id${loc}`).removeClass("border-danger")
            $(`#id${loc}`).addClass("border-success")
        },
        error: (err)=>{console.log(err.responseText)}
    })

    
}