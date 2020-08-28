var activeDepartmentTabs = [];
var activeLocationTabs = [];
var activeElem;
var scrollHeight;
var savedHeight;
var activeUser;

window.addEventListener("scroll", (event) => {
    scrollHeight = this.scrollY;
});

window.onload = function(){
    //fillJobs()
    windowHeight = ($(window).height() - 58);

    $('#signInForm').submit(function (e) {
        console.log(e)
        e.preventDefault();
    })

    $("#usernameInput").focus()
    
    
    $(document).click(function (event) {
        hideAlert();
    });
}


function logoutClicked(){
    $("#openPage").css("opacity","1")
    $("#openPage").show()
    $("#directoryList").empty()
    $("#resultList").empty()
    $("#signInForm").collapse("show")
}

function loginClicked(){
    username = $("#usernameInput").val()
    password = $("#passwordInput").val()

    if ((username == "") || (password=="")){
        loginFailed()
        return
    }
    $("#signInForm").collapse("hide")

    console.log("Username "+username)
    console.log("Password "+password)
    
    verifyLogin(username,password)
}

function verifyLogin(username,password){
    console.log(password)
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `verifyLogin`, arguments: [username,password]},
        success: (obj)=>{
            console.log(obj)
            if (obj ==true){
                loginVerified(username)
                activeUser = username            
            } else {
                loginFailed()
            }
        },
        error: (err)=>{console.log(err.responseText)}
    })
}

function loginFailed(){
    $("#signInForm").addClass("show")
    $("#usernameInput").addClass("border-danger")
    $("#passwordInput").addClass("border-danger")
    showAlert()
    $("#alertText").text("Login Details Incorrect")
    $("#alertText").removeClass("bg-success")
    $("#alertText").removeClass("bg-warning")
    $("#alertText").addClass("bg-danger")
}

function loginVerified(username){
    $( "#openPage" ).animate({
        opacity: 0
    }, 1000, function() {
        $("#openPage").hide()
    });
    fillAutoComplete()
    groupByLocation();
    if (activeUser != "admin"){
        //$("#createTab").addClass("d-none")
    } else {
        //$("#createTab").removeClass("d-none")
    }
}

function getElementLocation(elem){
    savedHeight = scrollHeight
    console.log(savedHeight)
}

function fillDirectory(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'search', arguments: [obj]},
        success: (res)=>{
            console.log(res)
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
            <a href="#" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${record.id})" class="stretched-link"></a>
            </li>`



            $(`#collapse${record.departmentName.split(" ").join("")}`).append(recordHTML)
            i++;
        })}
})
}
 

function groupByChanged(elem){
    option = elem.value
    activeDepartmentTabs = [];
    activeLocationTabs = [];
    switch (option){
        case 'locations':
            groupByLocation()
            break; 
        case 'departments':
            groupByDepartment()
            break;
        case 'none':
            groupByNone()
            break;
    }
}

function groupByNone(){
    fillLocations()
    fillDepartments()
    $("#directoryList").empty()
    displayPersonnel()
}

function groupByDepartment(){
    fillLocations()
    fillDepartments()
    $("#directoryList").empty()
    displayDepartmentsList()
}

function groupByLocation(){
    fillLocations()
    fillDepartments()
    $("#directoryList").empty()
    displayLocationsList()
}

function displayPersonnel(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `search`, arguments: [obj]},
        success: (people)=>{
            i=0;
            people.forEach((record)=>{
                personHtml = `<li class="list-group-item bg-light h-10">
                <h4>${record.firstName} ${record.lastName}</h4>
                <h5>${record.email}</h5>
                <div class="row"><div class="col">ID:${record.id}</div><div class="col float-right">${record.departmentName}</div></div>
                <div class="row"><div class="col">${record.jobTitle}</div><div class="col float-right">${record.departmentHead}</div></div>
                <a href="#" id="${record.id}" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${record.id}), getElementLocation(this)" class="stretched-link"></a>
                </li>`
                $("#directoryList").append(personHtml)
            })
        }
    })

}

function displayDepartmentsList(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `getDepartmentsAndLocations`},
        success: (locandDep)=>{
            departments = locandDep[0]
            departments.forEach((department)=>{
                departmentHtml = `<li class="list-group-item" id="${department.name.split(" ").join("")}" type="button" data-toggle="collapse" act="0" onclick="dropdownOpened(this)" data-target="#collapse${department.name.split(" ").join("")}" aria-expanded="false" aria-controls="collapse${department.name.split(" ").join("")}">${department.name} <span class="float-right" id="${department.name.split(" ").join("")}Count"></span></li>
                <ul id="collapse${department.name.split(" ").join("")}" class="collapse"></ul>`
                $("#directoryList").append(departmentHtml)
                displayPersonnelList(department.id,department.name)
            })
        }
    })

}

function displayLocationsList(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `getDepartmentsAndLocations`},
        success: (locandDep)=>{
            locations = locandDep[1]
            departments = locandDep[0]
            locations.forEach((location)=>{
                locationHtml = `<li class="list-group-item" id="${location.name.split(" ").join("")}" type="button" data-toggle="collapse" act="0" onclick="dropdownOpened(this)" data-target="#collapse${location.name.split(" ").join("")}" aria-expanded="false" aria-controls="collapse${location.name.split(" ").join("")}">${location.name} <span class="float-right" id="${location.name.split(" ").join("")}Count"></span></li>
                <ul id="collapse${location.name.split(" ").join("")}" class="collapse"></ul>`
                $("#directoryList").append(locationHtml)
                
            })
            displayLocationDepartmentsList(locations)
        }
    })
}

function displayLocationDepartmentsList(locations){
    departments = [];
    locations.forEach((location)=>{
        jQuery.ajax({
            type: "POST",
            url: 'php/companydir.php',
            dataType: 'json',
            data: {functionname: `getDepartmentNamesAndIdsFromLocation`, arguments: [location.id]},
            success: (departments)=>{
                for (i=0;i<departments[0].length;i++){
                    locationHtml = `<li class="list-group-item" id="${departments[1][i].split(" ").join("")}" onclick="departmentDropdownOpened(this)"type="button" data-toggle="collapse" act="0" data-target="#collapse${departments[1][i].split(" ").join("")}" aria-expanded="false" aria-controls="collapse${departments[1][i].split(" ").join("")}">${departments[1][i]} <span class="float-right" id="${departments[1][i].split(" ").join("")}Count"></span></li>
                    <ul id="collapse${departments[1][i].split(" ").join("")}" class="collapse"></ul>`
                    $(`#collapse${location.name.split(" ").join("")}`).append(locationHtml)
                    displayPersonnelList(departments[0][i],departments[1][i])
                    $(`#${location.name.split(" ").join("")}Count`).text(i+1)
                }
                
            }
        })

    })
}

function displayPersonnelList(departmentId, departmentName){
    obj = {firstName:"",lastName:"",email:"",id:"",department:departmentId,location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `search`, arguments: [obj]},
        success: (people)=>{
            i=0;
            people.forEach((record)=>{
                personHtml = `<li class="list-group-item bg-light h-10">
                <h4>${record.firstName} ${record.lastName}</h4>
                <h5>${record.email}</h5>
                <div class="row"><div class="col">ID:${record.id}</div><div class="col float-right">${record.departmentName}</div></div>
                <div class="row"><div class="col">${record.jobTitle}</div><div class="col float-right">${record.departmentHead}</div></div>
                <a href="#" id="${record.id}" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${record.id}), getElementLocation(this)" class="stretched-link"></a>
                </li>`
        
                        $(`#collapse${departmentName.split(" ").join("")}`).append(personHtml)
                        i++
                        $(`#${departmentName.split(" ").join("")}Count`).text(i)

                    })
                    openActiveTabs()
                    window.scrollTo(0,savedHeight)

                }
    })    

}

function openActiveTabs(){
    
    
    activeLocationTabs.forEach((elem)=>{
        $(`#${elem}`).addClass("bg-primary")
        $(`#${elem}`).addClass("text-light")
        $(`#${elem}`).addClass("font-weight-bold")
        $(`#${elem}`).attr("act",1)
        $(`#collapse${elem}`).addClass("show")
    })

    activeDepartmentTabs.forEach((elem)=>{
        $(`#${elem}`).addClass("bg-secondary")
        $(`#${elem}`).addClass("text-light")
        $(`#${elem}`).addClass("font-weight-bold")
        $(`#${elem}`).attr("act",1)
        $(`#collapse${elem}`).addClass("show")
    })


    window.scrollTo(0,scrollHeight);
}

function dropdownOpened(elem){
    
    id = elem.getAttribute('id')
    
    console.log(elem)
    
    isActive = elem.getAttribute('act')
    console.log(isActive)

    if (isActive == 0){
        id = elem.getAttribute('id')
        elem.classList.add("bg-primary")
        elem.classList.add("text-light")
        elem.classList.add("font-weight-bold")
        elem.setAttribute("act",1)
        activeLocationTabs.push(id)
        console.log(id)
    } else {
        elem.classList.remove("bg-primary")
        elem.classList.remove("text-light")
        elem.classList.remove("font-weight-bold")
        elem.setAttribute("act",0)
        activeLocationTabs = activeLocationTabs.filter(function(e) { return e !== id })
    }
}

function departmentDropdownOpened(elem){
    console.log(elem)
    isActive = elem.getAttribute('act')
    id = elem.getAttribute('id')

    if (isActive == 0){
        elem.classList.add("bg-secondary")
        elem.classList.add("text-light")
        elem.classList.add("font-weight-bold")
        elem.setAttribute("act",1)
        activeDepartmentTabs.push(id)
    } else {
        elem.classList.remove("bg-secondary")
        elem.classList.remove("font-weight-bold")
        elem.classList.remove("text-light")
        elem.setAttribute("act",0)
        activeDepartmentTabs = activeDepartmentTabs.filter(function(e) { return e !== id })
    }
}

//Reloads results from search
function goBackToResults(){
    $("#search").hide()
    $("#create").hide()
    $("#entry").hide()
    $("#searchResults").show()
}

//Gets data from JSON file and fills autocomplete for jobTitles
function fillAutoComplete(){
        $('.basicAutoComplete').autoComplete({
            preventEnter: true,
            minLength:0,
            resolverSettings: {
                url: '../departments.json'
            }
        });
}

//Fills in the jobs and assigning Department Heads
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

//Clears search form
function clearSearch(){
    $('#searchForm').trigger("reset");
}

//Clears create form
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

function directoryClicked(){
    $("#searchResults").hide();
    $("#search").hide();
    $("#entry").hide();
    $("#create").hide();
    $("#directory").show();
    $("#searchTab").addClass("text-light");
    $("#searchTab").removeClass("active");
    $("#createTab").addClass("text-light");
    $("#createTab").removeClass("active");
    $("#directoryTabCheck").text("(current)")
    $("#directoryTab").addClass("active")
    $("#directoryTab").addClass("text-dark")
    $("#searchTabCheck").text("")
    $("#createTabCheck").text("")
}

function createDepartmentClicked(){
    $("#departmentCreateForm").trigger('reset')
    $("#createModalLabel").text("Department")
    $("#departmentCreateForm").removeClass("d-none")
    $("#personCreateForm").addClass("d-none")
    $("#locationCreateForm").addClass("d-none")
    $("#createButton").removeAttr("onclick")
    $("#createButton").attr("onclick", "createDepartment()")
}

function createLocationClicked(){
    $("#locationCreateForm").trigger('reset')
    $("#createModalLabel").text("Location")
    $("#departmentCreateForm").addClass("d-none")
    $("#personCreateForm").addClass("d-none")
    $("#locationCreateForm").removeClass("d-none")
    $("#createButton").removeAttr("onclick")
    $("#createButton").attr("onclick", "createLocation()")

}

function createPersonClicked(){
    groupByLocation()
    $("#personCreateForm").trigger('reset')
    $("#createModalLabel").text("Person")
    $("#departmentCreateForm").addClass("d-none")
    $("#locationCreateForm").addClass("d-none")
    $("#personCreateForm").removeClass("d-none")
    $("#createButton").removeAttr("onclick")
    $("#createButton").attr("onclick", "submitCreate()")

}

function createDepartment(){
    departmentName = $("#departmentInputCreate").val();
    locationid = $("#locationCreate").val()
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'addDepartment', arguments:[departmentName,locationid]},
        success: (obj)=>{
            if(obj == true){
                showAlert()
                groupByLocation()
                $("#alertText").text("Department Successfully Added")
                $("#alertText").removeClass("bg-danger")
                $("#alertText").removeClass("bg-warning")
                $("#alertText").addClass("bg-success")
                $("#createModal").modal('hide')
            } else {
                showAlert()
                $("#alertText").text("Department Already Exists")
                $("#alertText").removeClass("bg-danger")
                $("#alertText").addClass("bg-warning")
                $("#alertText").removeClass("bg-success")
                $("#createModal").modal('show')
            }
        },
        error: (er)=>{console.log(er.responseText)}
        
    })

}

function createLocation(){
    locationName = $("#locationInputCreate").val();
        jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'addLocation', arguments:[locationName]},
        success: (obj)=>{
            if(obj == true){            
                groupByLocation()
                showAlert()
                $("#alertText").text("Location Successfully Added")
                $("#alertText").removeClass("bg-danger")
                $("#alertText").removeClass("bg-warning")
                $("#alertText").addClass("bg-success")
                $("#createModal").modal('hide')
            } else {
                showAlert()
                $("#alertText").text("Location Already Exists")
                $("#alertText").removeClass("bg-danger")
                $("#alertText").addClass("bg-warning")
                $("#alertText").removeClass("bg-success")
                $("#createModal").modal('show')
            }
        },
        error: (er)=>{console.log(er.responseText)}
        
    })

}

//Shows and clears search form and hides the rest
function searchClicked(){
    $("#resultList").empty()
    $("#searchResults").hide()
    $("#directory").hide()
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
    $("#directoryTab").removeClass("active")
    $("#directoryTab").removeClass("text-dark")
    $("#directoryTab").addClass("text-light");


}

//Shows dropdown alert, then hides it 
function showAlert(){
    $("#collapseAlert").css("z-index","2000")
    $("#collapseAlert").collapse("show")
    setTimeout(hideAlert,5000)

}

//Hides dropdown
function hideAlert(){
    $("#collapseAlert").collapse("hide")
}

//Gets location name and ID from department ID
function getLocationFromDepartment(depID){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getLocationFromDepartment', arguments: [depID]},
        success: (ob)=>{},
        error: (er)=>{console.log(er.responseText)}
    })
}

//Gets data from search form and querys database 
function submitSearch(){
    obj = {};
    obj.firstName = $("#firstNameSearch").val()
    obj.lastName = $("#lastNameSearch").val()
    obj.email = $("#emailSearch").val()
    obj.id = $("#idSearch").val()
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
    
    $("firstNameShow").removeClass("d-none")
    $("firstNameInput").addClass("d-none")
    
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getPersonByID', arguments: [id]},
        success: displayEntry,
        error: (er)=>{console.log(er.responseText)}
    })
    
}

//Populates entry with details 
function displayEntry(person){
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

    $("#deleteButton").removeAttr("onclick");
    $("#saveButton").removeAttr("onclick");
    $("#deleteButton").attr("onclick", `deleteClicked(${person.id})`)
    $("#saveButton").attr("onclick", `saveEntry(${person.id})`)
 
}

function deleteClicked(id){
    $("#deleteModal").modal("show")
    $("#deleteName").text($('#firstNameInput').val())
    $("#deleteSecondButton").removeAttr("onclick")
    $("#deleteSecondButton").attr("onclick", `deleteEntry(${id})`)
}

//Delets entry from ID
function deleteEntry(id){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'deleteEntry', arguments: [id]},
        success: (obj)=>{
            groupByLocation()
            showAlert()
            $("#alertText").removeClass("bg-warning")
            $("#alertText").removeClass("bg-success")
            $("#alertText").text("Entry Deleted")
            $("#alertText").addClass("bg-danger")

        },
        error: (err)=>{console.log(err.responseText)}
    })
}

//Gets all data from edit entry form 
function saveEntry(id){
    person = {}
    person.id = $("#idInput").val()
    

    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'checkID', arguments: [person.id]},
        success: (obj)=>{
            if (obj == 'false' || person.id == id){
                person.firstName = $("#firstNameInput").val()
                person.lastName = $("#lastNameInput").val()
                person.email = $("#emailInput").val()
                person.jobTitle = $("#jobTitleInput").val()
                person.departmentID = $("#departmentInput option:selected").val()
                $("#entryModal").modal('hide')
                
                updatePerson(person,id)

            } else{                
                showAlert()
                $("#alertText").text("ID in use")
                $("#alertText").removeClass("bg-warning")
                $("#alertText").removeClass("bg-success")
                $("#alertText").addClass("bg-danger")
                
                $("#entryModal").modal('show')
            }

        },
        error: (err)=>{console.log(err.responseText)}
    })
    
    


    


}

//Updates record with matching id
function updatePerson(person,id){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateAll', arguments: [person,id]},
        success: (obj)=>{
            showAlert()
            groupByLocation();
            $("#alertText").removeClass("bg-warning")
            $("#alertText").removeClass("bg-danger")
            $("#alertText").addClass("bg-success")
            $("#alertText").text("Record Succesfully Updated")
        },
        error: (err)=>{console.log(err.responseText)}
    })
}

//Shows edit option, hides display
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

//Makes unavailable locations unchoosable
function blurSearchLocations(){
    departmentID = $("#departmentSearch").val()
    if (departmentID ==""){
        options = $("#locationSearch").children()
        for (i=0;i<options.length;i++){
            options[i].removeAttribute("disabled")
    }
    return;
    }
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getLocationIDFromDepartment', arguments: [departmentID]},
        success: (obj)=>{
            options = $("#locationSearch").children()
            for (i=0;i<options.length;i++){
                if (obj.value === ""){
                    options[i].removeAttribute("disabled")
                    continue;
                }
                if (options[i].value == obj){
                    options[i].removeAttribute("disabled")
                } else {
                    options[i].setAttribute("disabled","true")
                }
                

            }
        }
    })

}

//Updates one column on record 
function updateSingleCol(id, elem){
    if (elem=="departmentID"){
        val = $(`#departmentInput`).val()
    } else {
        val = $(`#${elem}Input`).val()
    }
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
                if (elem == "id"){
                $("#saveButton").removeAttr("onclick")
                $("#saveButton").attr("onclick",`saveEntry(${val})`)
                
                }

                if (elem =="departmentID"){
                    elem = "department" 
                    jQuery.ajax({
                        type: "POST",
                        url: 'php/companydir.php',
                        dataType: 'json',
                        data: {functionname: 'getDepHeadName', arguments: [val]},
                        success: (obj)=>{
                            $(`#entryDepHead`).text(obj[0])
                            $(`#entryDepHead`).removeAttr("onclick")
                            $(`#entryDepHead`).attr("onclick",`entryClicked(${obj[1]})`)
                        }, error: (er)=>{console.log(er.responseText)}
                    })
                }
                if (elem =="department"){
                    $(`#${elem}Entry`).text($(`#${elem}Input :selected`).text())
                } else {
                    $(`#${elem}Entry`).text($(`#${elem}Input`).val())
                }
                $(`#${elem}Show`).removeClass("d-none")
            $(`#${elem}Show`).addClass("d-flex")
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


//Show search reuslts and populate with list 
function showResults(res){
    //clearSearch()
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
        <a href="#" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${record.id})" class="stretched-link"></a>
        </li>`



        $("#resultList").append(recordHTML)
        i++;
    })
}

//Fills the location options from database
function fillLocations(){
    $("locationSearch").empty()
    $("locationCreate").empty()
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

                
                option1 = document.createElement("option") 
                option1.value = location.id;
                option1.text = location.name;
                $('#locationCreate').append(option)
            })
        },
        error: (er)=>{console.log(er)}
        
    })
}

//Fills the department options from database
function fillDepartments(){
    $('#departmentSearch').empty()
    $('#departmentInput').empty()
    $('#departmentCreate').empty()

    emptyOption = '<option value="" selected>Please select</option>'
    $('#departmentSearch').append(emptyOption)
    $('#departmentInput').append(emptyOption)
    $('#departmentCreate').append(emptyOption)

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
        error: (er)=>{console.log(er.responseText)}
        
    })
}

//Checks if email is valid and changes border 
function checkEmail(elem){
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    elem.classList.remove("bg-success")    
    elem.classList.remove("bg-danger")
    if (!elem.value || !emailRegex.test(elem.value)){
        elem.classList.remove("border-success")
        elem.classList.add("border-danger")
    } else {
        elem.classList.remove("border-danger")
        elem.classList.add("border-success")
    }
    
}

//Checks if element is empty
function checkEmpty(elem){
    elem.classList.remove("border-success")    
    elem.classList.remove("border-danger")
    if (!elem.value){
        elem.classList.add("border-danger")
    } else {
        elem.classList.add("border-success")
    }
}

//Submits create form, checks for valid values
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
            groupByLocation()
            $("#alertText").text("Entry Created")
            $("#alertText").removeClass("bg-warning")
            $("#alertText").removeClass("bg-danger")
            $("#alertText").addClass("bg-success")
            $("#createModal").modal('hide')
            } else {            
                showAlert()
                $("#alertText").text("ID already in use")
                $("#alertText").removeClass("bg-success")
                $("#alertText").removeClass("bg-danger")
                $("#alertText").addClass("bg-warning")
                    
                $("#createModal").modal('show')
            }
        },
        error: (er)=>{console.log(er.responseText)}
        
    })

}

//Checks for valid ID (if it exists in search/if it doesn't in create)
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

//Fills ID with valid number from database
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