window.onload = function(){
    //fillJobs()
    $("#entry").hide()
    $("#create").hide() 
    fillLocations()
    fillDepartments()
    $(document).click(function (event) {
        hideAlert();
    });
}

function fillJobs(){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'fillJobs'},
        success: (obj)=>{console.log(obj)},
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
    obj = {};
    obj.firstName = $("#firstNameSearch").val()
    obj.lastName = $("#lastNameSearch").val()
    obj.email = $("#emailSearch").val()
    obj.id = $("#idSearch").val()
    console.log(Number(obj.id))
    if (Number(obj.id) == NaN){
        $("idSearch").addClass("border-danger")
        return false;
    }
    console.log(obj.id)
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
    $("#recordOutput").empty();
    $("#firstNameEntry").text(person.firstName)
    $("#firstNameShow").removeClass("d-none")
    $("#firstNameShow").addClass("d-flex")
    $("#firstNameInput").val(person.firstName)
    $("#firstNameInput").addClass("d-none")

    $("#lastNameEntry").text(person.lastName)
    $("#lastNameShow").removeClass("d-none")
    $("#lastNameShow").addClass("d-flex")
    $("#lastNameInput").val(person.lastName)
    $("#lastNameInput").addClass("d-none")

    $("#emailEntry").text(person.email)
    $("#emailShow").removeClass("d-none")
    $("#emailShow").addClass("d-flex")
    $("#emailInput").val(person.email)
    $("#emailInput").addClass("d-none")

    $("#departmentEntry").text(person.departmentName)
    $("#departmentShow").removeClass("d-none")
    $("#departmentShow").addClass("d-flex")
    $("#departmentInput").val(person.departmentID)
    $("#departmentInput").addClass("d-none")

    
    $("#jobTitleEntry").text(person.jobTitle)
    $("#jobTitleShow").removeClass("d-none")
    $("#jobTitleShow").addClass("d-flex")
    $("#jobTitleInput").val(person.jobTitle)
    $("#jobTitleInput").addClass("d-none")
    
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
    person.id = id
    person.firstName = $("#firstNameInput").val()
    person.lastName = $("#lastNameInput").val()
    person.email = $("#emailInput").val()
    person.jobTitle = $("#jobTitleInput").val()
    person.departmentID = $("#departmentInput option:selected").val()
    


    updatePerson(person)


}

function updatePerson(person){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateAll', arguments: [person]},
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
    console.log(elem)
    $(`#${elem}Input`).removeClass("d-none")
    $(`#${elem}Show`).removeClass("d-flex")
    $(`#${elem}Show`).addClass("d-none")
}

function updateName(id){
    firstName = $("#firstNameEdit").val()
    lastName = $("#lastNameEdit").val()
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateName', arguments: [firstName,lastName,id]},
        success: (obj)=>{
            $("#fullName").text(`${obj[0]} ${obj[1]}`)                
            $(`#nameEdit`).addClass("d-none")
            $(`#nameRecord`).show()
            $(`#nameRecord`).addClass("d-flex")
        },
        error: (err)=>{console.log(err.responseText)}
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
    

    $("#search").hide()
    $("#searchResults").show()

    i=0;
    res.forEach(function(record){
        console.log(record)
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
        console.log("empty")
        elem.classList.remove("border-success")
        elem.classList.add("border-danger")
    } else {
        console.log("not empty")
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
    }
    if (obj.lastName==""){
        errArr.push("Must Enter Last Name")
    } 
    if (obj.email=="" || (emailRegex.test(obj.email) == false)){
        errArr.push("Must enter valid email")
    } 
    if (obj.departmentID == ""){
        errArr.push("Must choose a department")
    } 


    if(errArr.length > 0){
        $("#alertText").text(errArr.join(" / "))
        $("#alertText").addClass("bg-warning")
        showAlert()
        return
    }

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
    console.log(elem)
    if (elem == undefined){
        $("#idCreate").removeClass("border-danger")
        $("#idCreate").removeClass("border-success")
        return
    }
    id=elem.value
    console.log(id)
    if (!id){
        console.log("noid")
        elem.classList.remove("border-success")
        elem.classList.remove("border-danger")
        return
    }
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'checkID', arguments: [id]},
        success: (obje)=>{
            console.log(obje)
            if(elem.id=="idSearch"){
                console.log("Search")
                if (obje == "false"){
                    console.log("Theres a match")
                    elem.classList.add("border-danger")
                    elem.classList.remove("border-success")
                } else {
                    console.log("No match")
                    elem.classList.add("border-success")
                    elem.classList.remove("border-danger")
                }
            } else if(elem.id=="idCreate"){
                console.log("Create")
                if (obje == "true"){
                    console.log("No Match")
                    elem.classList.add("border-danger")
                    elem.classList.remove("border-success")
                } else {
                    console.log("Theres a match")
                    elem.classList.add("border-success")
                    elem.classList.remove("border-danger")
                }
            }
            
        },
        error: (err)=>{console.log(err.responseText)}
    })
    
}

function fillID(loc){
    console.log(loc)
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getAvailableIDs'},
        success: (obje)=>{
            ranNum = Math.floor(Math.random()*10)
            $(`#id${loc}`).val(obje[ranNum])
        },
        error: (err)=>{console.log(err.responseText)}
    })

    
}