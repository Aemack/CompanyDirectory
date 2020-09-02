var activeDepartmentTabs = [];
var activeLocationTabs = [];
var searchResults = [];
var activeElem;
var scrollHeight;
var savedHeight;
var activeUser;
var activeWindow;
var userKey;

//Get scroll value on scroll
window.addEventListener("scroll", (event) => {
    scrollHeight = this.scrollY;
});

window.onload = function(){
    //Untick to fill in jobs
    //fillJobs()
    window.FontAwesomeConfig = { autoReplaceSvg: false }


    //Gets available window height to resize boxes
    windowHeight = ($(window).height() - 66);

    //Prevents sign in form refreshing page
    $('#signInForm').submit(function (e) {
        e.preventDefault();
    })

    //Puts focus on username input
    $("#usernameInput").focus()

    //Gives menu button control over sidebar
    $(".menu-button").click(function(){
        $('.sidebar-container').toggleClass('sidebar-container-active')
        $(".menu-button").toggleClass('menu-active')
    })

    //Hides sidebar when clicking outside nav
    $("#main").click(function (event){
        hideSidebar()   
    })
    
    //Hides alert on click anywhere on window
    $(document).click(function (event) {
        hideAlert();
    });
}

        /*!!!! FILL VALUES !!!!*/

//Gets data from JSON file and fills autocomplete for jobTitles
function fillAutoComplete(){
    $('.basicAutoComplete').autoComplete({
        preventEnter: true,
        minLength:0,
        resolverSettings: {
            url: 'jobTitles.json'
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

//Fills directory with all results of search
function fillDirectory(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'search', arguments: [obj,userKey]},
        success: (res)=>{
        i=0;
        res.forEach(function(record){
            if (i%2==0){
                recordHTML = `<li class="list-group-item h-10">`
            } else {
                recordHTML = `<li class="list-group-item h-10">`
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
                ${record.departmentName}    
                </div>
            </div>
            <a href="#" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${record.id})" class="stretched-link"></a>
            </li>`



            $(`#collapse${record.departmentName.replace(/[^a-zA-Z]/g, "")}`).append(recordHTML)
            i++;
        })}
})
}

//Fills the location options from database
function fillLocations(){
    $("#locationSearch").empty()
    $("#locationCreate").empty()

    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getLocations', arguments: [userKey]},
        success: (obje)=>{
            obje.forEach(function(location){
                option = document.createElement("option") 
                option.value = location.id;
                option.text = location.name;
                $('#locationSearch').append(option)

                
                option1 = document.createElement("option") 
                option1.value = location.id;
                option1.text = location.name;
                $('#locationCreate').append(option1)

                
            })
            
            $('#locationSearch').selectpicker();
        },
        error: (er)=>{console.log(er.responseText)}
        
    })
}

//Fills ID with valid number from database
function fillID(loc){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getAvailableIDs', arguments: [userKey]},
        success: (obje)=>{
            ranNum = Math.floor(Math.random()*10)
            $(`#id${loc}`).val(obje[ranNum])
            $(`#id${loc}`).removeClass("border-danger")
            $(`#id${loc}`).addClass("border-success")
        },
        error: (err)=>{console.log(err.responseText)}
    })

    
}

// Fills dashboard with data from database
function fillDashboard(){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `getDashboardData`, arguments: [userKey]},
        success: (obj)=>{
            $("#dashboardLocationsList").empty()
            $("#dashboardDepartmentsList").empty()
            $("#dashboardPersonnelList").empty()
            
            $("#locationCardDisplay").text(obj.location)
            $("#departmentCardDisplay").text(obj.department)
            $("#personnelCardDisplay").text(obj.personnel)

            obj.locations.forEach((location)=>{
                locationHtml= `<li class="dashboard-list-item class="text-center">${location.name}<div id="${location.name.replace(/[^a-zA-Z]/g, "")}DashboardCount"></div></br></li>`
                $("#dashboardLocationsList").append(locationHtml)
            })

            obj.departments.forEach((department)=>{
                departmentHtml= `<li class="dashboard-list-item class="text-center">${department.name}<div id="${department.name.replace(/[^a-zA-Z]/g, "")}DashboardCount"></div></li></br>`
                $("#dashboardDepartmentsList").append(departmentHtml)
            })

            obj.depHeads.forEach((depHead)=>{
                    depHeadsHtml= `<li data-target="#entryModal" data-toggle="modal" class="dashboard-list-item class="text-center"><a href="#" onclick="entryClicked(${depHead.id})">${depHead.firstName} ${depHead.lastName}</a><div id="${depHead.departmentID.replace(/[^a-zA-Z]/g, "")}DashboardCount"></div></li></br>`
                    $("#dashboardPersonnelList").append(depHeadsHtml)
                
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
    //$('#departmentSearch').append(emptyOption)
    $('#departmentInput').append(emptyOption)
    $('#departmentCreate').append(emptyOption)

    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getDepartments', arguments: [userKey]},
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
            
            $('#departmentSearch').selectpicker();
        },
        error: (er)=>{console.log(er.responseText)}
        
    })
}

//Hides the Sidebar
function hideSidebar(){
    $('.sidebar-container').removeClass('sidebar-container-active')
    $("#menuButton").removeClass('menu-active')
}

//Reloads dashboard/directory/searchResult data
function reloadData(){
    fillDepartments()
    fillLocations()
    fillAutoComplete()
    if ($("#directory").css("display") != "none"){
        option = $("#groupBySelect").val();
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
            default:
                groupByLocation()
                breaks;
        }


        activeWindow="directory"
    } else if ($("#searchResults").css("display") != "none"){
        activeWindow="searchResults"
        submitSearch()
    } else {
        fillDashboard()
        activeWindow="dashboard"
    }


}


        /*!!!! LOGIN !!!!*/



//Emptys results and directory, shows sign in screen
function logoutClicked(){
    $("#openPage").css("opacity","1")
    $("#directory").hide("")
    $("#searchResults").hide("")
    $(".openPageImage").removeClass("openPage-animated")
    $("#openPage").show()
    $("#directoryList").empty()
    $("#resultList").empty()
    $("#signInForm").collapse("show")
    $(".dashboard-list").empty()
    userKey = ""
}

//Checks if username and pasword have been entered 
function loginClicked(){
    username = $("#usernameInput").val()
    password = $("#passwordInput").val()

    if ((username == "") || (password=="")){
        loginFailed()
        return
    }
    $("#signInForm").collapse("hide")

    
    verifyLogin(username,password)
}

//Verifies username and password agaimst the database
function verifyLogin(username,password){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `verifyLogin`, arguments: [username,password]},
        success: (obj)=>{
            if (obj.result ==true){
                userKey = obj.key    
                loginVerified(username)
                activeUser = username        
            } else {
                loginFailed()
            }
        },
        error: (err)=>{console.log(err.responseText)}
    })
}

//Shows alert/keeps sign in form in view
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

//Hides sign in form / fills and shows dashboard
function loginVerified(username){
    fillDashboard()
    fillDepartments()
    fillLocations()
    groupByLocation()
    
    $("#usernameDisplay").text(username)
    $("#searchResults").hide("")
    $("#directory").show()
    $(".openPageImage").addClass("openPage-animated")
    $( "#openPage" ).animate({
        opacity: 0,
    }, 1000, function() {
        $("#openPage").hide()
    });
    fillAutoComplete()
}




        /*!!!! DIRECTORY !!!!*/


function getElementLocation(elem){
    savedHeight = scrollHeight
}

//Calls appropriate function when group by option is changed
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
        default:
            groupByLocation()
            breaks;
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

//Displays all entries individualy
function displayPersonnel(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `search`, arguments: [obj, userKey]},
        success: (people)=>{
            i=0;
            people.forEach((record)=>{
                personHtml = `<li class="list-group-item h-10">
                <h4>${record.firstName} ${record.lastName}</h4>
                <h5>${record.email}</h5>
                <div class="row"><div class="col">ID:${record.id}</div><div class="col float-right">${record.departmentName}</div></div>
                <div class="row"><div class="col">${record.jobTitle}</div><div class="col float-right">${record.departmentHead}</div></div>
                <a href="#" id="${record.id}" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${record.id}), getElementLocation(this)" class="stretched-link"></a>
                </li>`
                $("#directoryList").append(personHtml)
            })
        }, error: (err)=>{console.log(err.responseText)}
    })

}

//Displays entries under department headings
function displayDepartmentsList(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `getDepartmentsAndLocations`, arguments: [userKey]},
        success: (locandDep)=>{
            departments = locandDep[0]
            departments.forEach((department)=>{
                departmentHtml = `<li class="list-group-item" id="${department.name.replace(/[^a-zA-Z]/g, "")}" type="button" data-toggle="collapse" act="0" onclick="departmentDropdownOpened(this)" data-target="#collapse${department.name.replace(/[^a-zA-Z]/g, "")}" aria-expanded="false" aria-controls="collapse${department.name.replace(/[^a-zA-Z]/g, "")}">${department.name} <span class="float-right" id="${department.name.replace(/[^a-zA-Z]/g, "")}Count"></span></li>
                <ul id="collapse${department.name.replace(/[^a-zA-Z]/g, "")}" class="collapse"></ul>`
                $("#directoryList").append(departmentHtml)
                displayPersonnelList(department.id,department.name)
            })
        }, error: (err)=>{console.log(err.responseText)}
    })

}

//Displays entries under location headings
function displayLocationsList(){
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:"",jobTitle:""}
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: `getDepartmentsAndLocations`, arguments: [userKey]},
        success: (locandDep)=>{
            locations = locandDep[1]
            departments = locandDep[0]
            locations.forEach((location)=>{
                locationHtml = `<li class="list-group-item" id="${location.name.replace(/[^a-zA-Z]/g, "")}" type="button" data-toggle="collapse" act="0" onclick="dropdownOpened(this)" data-target="#collapse${location.name.replace(/[^a-zA-Z]/g, "")}" aria-expanded="false" aria-controls="collapse${location.name.replace(/[^a-zA-Z]/g, "")}">${location.name} <span class="float-right" id="${location.name.replace(/[^a-zA-Z]/g, "")}Count"></span></li>
                <ul id="collapse${location.name.replace(/[^a-zA-Z]/g, "")}" class="collapse"></ul>`
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
            data: {functionname: `getDepartmentNamesAndIdsFromLocation`, arguments: [location.id,userKey]},
            success: (departments)=>{
                for (i=0;i<departments[0].length;i++){
                    locationHtml = `<li class="list-group-item" id="${departments[1][i].replace(/[^a-zA-Z]/g, "")}" onclick="departmentDropdownOpened(this)"type="button" data-toggle="collapse" act="0" data-target="#collapse${departments[1][i].replace(/[^a-zA-Z]/g, "")}" aria-expanded="false" aria-controls="collapse${departments[1][i].replace(/[^a-zA-Z]/g, "")}">${departments[1][i]} <span class="float-right" id="${departments[1][i].replace(/[^a-zA-Z]/g, "")}Count"></span></li>
                    <ul id="collapse${departments[1][i].replace(/[^a-zA-Z]/g, "")}" class="collapse"></ul>`
                    $(`#collapse${location.name.replace(/[^a-zA-Z]/g, "")}`).append(locationHtml)
                    displayPersonnelList(departments[0][i],departments[1][i])
                    $(`#${location.name.replace(/[^a-zA-Z]/g, "")}Count`).text(i+1)
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
        data: {functionname: `search`, arguments: [obj, userKey]},
        success: (people)=>{
            i=0;
            people.forEach((record)=>{
                personHtml = `<li class="list-group-item h-10">
                <h4>${record.firstName} ${record.lastName}</h4>
                <h5>${record.email}</h5>
                <div class="row"><div class="col">ID:${record.id}</div><div class="col float-right">${record.departmentName}</div></div>
                <div class="row"><div class="col">${record.jobTitle}</div><div class="col float-right">${record.departmentHead}</div></div>
                <a href="#" id="${record.id}" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${record.id}), getElementLocation(this)" class="stretched-link"></a>
                </li>`
        
                        $(`#collapse${departmentName.replace(/[^a-zA-Z]/g, "")}`).append(personHtml)
                        i++
                        $(`#${departmentName.replace(/[^a-zA-Z]/g, "")}Count`).text(i)

                    })
                    openActiveTabs()
                    window.scrollTo(0,savedHeight)

                }
    })    

}

//Restyles and opens active lists 
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
    
    
    isActive = elem.getAttribute('act')

    if (isActive == 0){
        id = elem.getAttribute('id')
        elem.classList.add("bg-primary")
        elem.classList.add("text-light")
        elem.classList.add("font-weight-bold")
        elem.setAttribute("act",1)
        activeLocationTabs.push(id)
    } else {
        elem.classList.remove("bg-primary")
        elem.classList.remove("text-light")
        elem.classList.remove("font-weight-bold")
        elem.setAttribute("act",0)
        activeLocationTabs = activeLocationTabs.filter(function(e) { return e !== id })
    }
}

function departmentDropdownOpened(elem){
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

//Hides searchResults/directory and shows dashboard
function dashboardClicked(){
    fillDashboard()
    hideSidebar()
    $("#dashboard").show()
    $("#searchResults").hide();
    $("#directory").hide();
}

//Hides searchResults/dashboard and shows directory
function directoryClicked(){
    groupByLocation();
    hideSidebar()
    $("#dashboard").hide()
    $("#searchResults").hide();
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

        /*!!!! ALERT !!!!*/

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
        /*!!!! SEARCH !!!!*/

//Shows and clears search form and hides the rest
function searchClicked(){
    $("#searchForm").trigger("reset")
    $("#menuButton").removeClass('menu-active')
    $(".sidebar-container").removeClass("sidebar-container-active")
    $("#searchModal").modal("show")
    
    $("#departmentSearch").selectpicker("refresh");
    $("#locationSearch").selectpicker("refresh");
    $('#locationSearch').selectpicker('deselectAll')
    
    $('#departmentSearch').selectpicker('deselectAll')


}

//Clears search form
function clearSearch(){
    $('#searchForm').trigger("reset");
}

function submitSearch(){

    //Gets data from form and saves it to object
    obj = {};
    obj.firstName = $("#firstNameSearch").val()
    obj.lastName = $("#lastNameSearch").val()
    obj.email = $("#emailSearch").val()
    obj.id = $("#idSearch").val()
    obj.locationArray = $("#locationSearch").val()
    obj.departmentArray = $("#departmentSearch").val()
    obj.jobTitle = $("#jobTitleSearch").val()
    obj.locationNames = $("button[data-id='locationSearch'] .filter-option .filter-option-inner-inner").text()
    obj.locationNames = obj.locationNames.split(",")
    obj.departmentNames = $("button[data-id='departmentSearch'] .filter-option-inner-inner").text()
    
    console.log(obj.departmentNames)
    //Sanitizes data
    if (obj.departmentNames == "Leave blank to search all..." || obj.departmentArray == null){
        
        obj.departmentNames = [""]
        obj.departmentArray = []
        obj.departmentArray[0] = ""
    } else {
        obj.departmentNames = obj.departmentNames.split(",")
    }

    console.log(obj)

    if (obj.locationNames[0] == "Leave blank to search all..." || obj.locationArray == null){
        obj.locationNames[0] = ""
        obj.locationArray = []
        obj.locationArray[0] = ""
    }
    
    for (i=0;i<obj.departmentNames.length;i++){
        obj.departmentNames[i] = obj.departmentNames[i].trim()
    }


    console.log(obj)
    //Checks whether any departments/locations have been provided
    if (obj.locationArray != null){
        searchLocations(obj)
    } else if (obj.departmentArray != null){
        obj.location = ""
        searchLocations(obj)
    } else {
        obj.location = ""
        obj.department = ""
        searchLocations(obj)
    }
}

function searchLocations(obj){
    promises = []
    obj.locationArray.forEach((locationId)=>{
        obj.location = locationId
        obj.departmentArray.forEach((departmentId)=>{
            obj.department = departmentId

            res = jQuery.ajax({
                type: "POST",
                url: 'php/companydir.php',
                dataType: 'json',
                data: {functionname: 'search', arguments: [obj, userKey]},
                success: (result)=>{},
                error:(err)=>{console.log(err.responseText)}
            })
            promises.push(res)        
        })
    })
    Promise.allSettled( promises ).then(function(object) {
        showResultsUnderLocation(object)
    })
}

function showResultsUnderLocation(results){
    $("#resultList").empty()
    peopleArrays=[]
    results.forEach((result)=>{
        if (result.status == "fulfilled"){
            result.value.forEach((res)=>{
                peopleArrays.push(res)
            })
        }
    })
    
    peopleArrays.forEach((person)=>{
        

        //Creates Location Headers
        if (!$(`#collapse${person.locationName.replace(/[^a-zA-Z]/g, "")}Search`).length){
        locationHtml = `<li class="list-group-item" id="${person.locationName.replace(/[^a-zA-Z]/g, "")}Title" type="button" data-toggle="collapse" act="0" onclick="dropdownOpened(this)" data-target="#collapse${person.locationName.replace(/[^a-zA-Z]/g, "")}Search" aria-expanded="false" aria-controls="collapse${person.locationName.replace(/[^a-zA-Z]/g, "")}Search">${person.locationName} <span class="float-right" id="${person.locationName.replace(/[^a-zA-Z]/g, "")}SearchCount"></span></li>
        <ul id="collapse${person.locationName.replace(/[^a-zA-Z]/g, "")}Search" class="collapse"></ul>`
        $("#resultList").append(locationHtml)
        }

        //Creates Department Headers
        if (!$(`#collapse${person.departmentName.replace(/[^a-zA-Z]/g, "")}Search`).length){
            departmentHtml = `<li class="list-group-item" id="${person.departmentName.replace(/[^a-zA-Z]/g, "")}Title" type="button" data-toggle="collapse" act="0" onclick="departmentDropdownOpened(this)" data-target="#collapse${person.departmentName.replace(/[^a-zA-Z]/g, "")}Search" aria-expanded="false" aria-controls="collapse${person.departmentName.replace(/[^a-zA-Z]/g, "")}Search">${person.departmentName} <span class="float-right" id="${person.departmentName.replace(/[^a-zA-Z]/g, "")}SearchCount"></span></li>
            <ul id="collapse${person.departmentName.replace(/[^a-zA-Z]/g, "")}Search" class="collapse"></ul>`
            $(`#collapse${person.locationName.replace(/[^a-zA-Z]/g, "")}Search`).append(departmentHtml)
            }

        //Creates Records
        recordHTML = `<li class="list-group-item h-10 search-record">
        <h4>${person.firstName} ${person.lastName}</h4>
        <h5>${person.email}</h5>
        <div class="row">
            <div class="col">
                ID:${person.id}
            </div>
            <div class="col">
            ${person.jobTitle}
            </div>
      </div>
      <div class="row">
        <div class="col">
                ${person.locationName}
            </div>
            <div class="col">
             ${person.departmentName} (<i>${person.departmentHead}</i>)
            </div>
        </div>
        <a href="#" data-toggle="modal" data-target="#entryModal" onclick="entryClicked(${person.id})" class="stretched-link"></a>
        </li>`


        $(`#collapse${person.departmentName.replace(/[^a-zA-Z]/g, "")}Search`).append(recordHTML)


    })
    $("#searchResults").show()
    $("#dashboard").hide()
    $("#directory").hide()

    

    if ($("#resultList").children().length == 0){
        noResults()
    } else {
        $("#searchModal").modal("hide")
    }
}

function noResults(){
    showAlert()
    $("#alertText").text("No Results")
    $("#alertText").addClass("bg-danger")
    $("#alertText").removeClass("bg-success")
    $("#alertText").removeClass("bg-warning")
    $("#dashboard").show()
    $("#searchResults").hide()
}

        /*!!!! ENTRY/EDIT !!!!*/


function entryClicked(id){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'getPersonByID', arguments: [id,userKey]},
        success: displayEntry,
        error: (er)=>{console.log(er.responseText)}
    })
    
}

function entryLocationClicked(locationID){
    
    obj = {firstName:"",lastName:"",email:"",id:"",department:"",location:locationID,jobTitle:"",locationArray:[""],departmentArray:[""]}
    console.log(locationID)
    $('#locationSearch').selectpicker('deselectAll')
    $("#entryModal").modal("hide")
    $("#locationSearch").selectpicker("refresh");
    $("#locationSearch").val(locationID)
    //$("#searchModal").modal("show")

    console.log($("#locationSearch").val())
    submitSearch()
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
    $("#firstNameTickIcon").removeAttr("onclick");
    $("#firstNameTickIcon").attr("onclick",`updateSingleCol(${person.id},"firstName")`);

    $("#lastNameEntry").text(person.lastName)
    $("#lastNameShow").removeClass("d-none")
    $("#lastNameShow").addClass("d-flex")
    $("#lastNameInput").val(person.lastName)
    $("#lastNameInput").addClass("d-none")
    
    $("#lastNamePen").removeClass("d-none");
    $("#lastNameTick").addClass("d-none");
    $("#lastNameTickIcon").removeAttr("onclick");
    $("#lastNameTickIcon").attr("onclick",`updateSingleCol(${person.id},"lastName")`);

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
    $("#emailEntry").attr('href',`mailto:${person.email}`)

    $("#emailPen").removeClass("d-none");
    $("#emailTick").addClass("d-none");
    $("#emailTick").removeAttr("onclick");
    $("#emailTick").attr("onclick",`updateSingleCol(${person.id},"email")`);

    
    $("#departmentEntry").text(person.departmentName)
    $("#departmentShow").removeClass("d-none")
    $("#departmentShow").addClass("d-flex")
    $("#departmentInput").val(person.departmentID)
    $("#departmentInput").addClass("d-none")
    $("#departmentLocation").text(person.locationName)
    //$("#departmentLocation").attr('onclick',`entryLocationClicked(${person.locationID})`)
    
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

 
function pasteFromClipboard(elem){
    navigator.clipboard.readText().then(clipText =>
        document.getElementById(`${elem}Input`).value = clipText);
}

//Gets all data from edit entry form 
function saveEntry(id){
    person = {}
    person.id = $("#idInput").val()
    

    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'checkID', arguments: [person.id,userKey]},
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
        data: {functionname: 'updateAll', arguments: [person,id,userKey]},
        success: (obj)=>{
            reloadData();
            showAlert();
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

function addJobTitle(title){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateJSON', arguments: [title,userKey]},
        success: (obje)=>{
        }
    })
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
        data: {functionname: 'deleteEntry', arguments: [id,userKey]},
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

//Updates one column on record 
function updateSingleCol(id, elem){
    if (elem == "jobTitle"){
        addJobTitle($(`#jobTitleInput`).val())
    }
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
        data: {functionname: 'updateDetails', arguments: [elem,val,id,userKey]},
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
                        data: {functionname: 'getLocationIDAndNameFromDepartment', arguments: [val, userKey]},
                        success: (obj)=>{
                            $(`#departmentLocation`).text(obj.locationName)
                            $(`#departmentLocation`).removeAttr("onclick")
                            $(`#departmentLocation`).attr("onclick",`entryLocationClicked(${obj.locationID})`)
                        }, error: (er)=>{console.log(er.responseText)}
                    })
                }

                if (elem =="department"){
                    $(`#${elem}Entry`).text($(`#${elem}Input :selected`).text())
                } else {
                    $(`#${elem}Entry`).text($(`#${elem}Input`).val())
                }

                reloadData();

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

    /*!!!! CREATE !!!!*/
    
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
        data: {functionname: 'checkID', arguments: [id, userKey]},
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

function createDepartmentClicked(){
    hideSidebar()
    $("#departmentCreateForm").trigger('reset')
    $("#createModalLabel").text("Department")
    $("#departmentCreateForm").removeClass("d-none")
    $("#personCreateForm").addClass("d-none")
    $("#locationCreateForm").addClass("d-none")
    $("#createButton").removeAttr("onclick")
    $("#createButton").attr("onclick", "createDepartment()")
}

function createLocationClicked(){
    hideSidebar()
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
    hideSidebar()
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
    departmentName = departmentName.replace("'","''")
    locationid = $("#locationCreate").val()

    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'addDepartment', arguments:[departmentName,locationid,userKey]},
        success: (obj)=>{
            if(obj == true){
                showAlert()
                reloadData()
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
    locationName = locationName.replace("'","''")
        jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'addLocation', arguments:[locationName, userKey]},
        success: (obj)=>{
            if(obj == true){    
                reloadData()
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

//Submits create form, checks for valid values
function submitCreate(){
    emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    obj = {};
    obj.id = $("#idCreate").val()
    obj.firstName = $("#firstNameCreate").val().replace("'","''")
    obj.lastName = $("#lastNameCreate").val().replace("'","''")
    obj.email = $("#emailCreate").val()
    obj.departmentID = $("#departmentCreate").val()
    obj.departmentName = $("#departmentCreate option:selected").text()
    obj.jobTitle = $("#jobTitleCreate").val().replace("'","''")
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

    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'create', arguments: [obj, userKey]},
        success: (obj)=>{
            if (obj != "ID or Email already in use"){
                
            $("#createModal").modal('hide')
            //displayEntry(obj)
            showAlert()
            reloadData()
            

            $("#alertText").text("Entry Created")
            $("#alertText").removeClass("bg-warning")
            $("#alertText").removeClass("bg-danger")
            $("#alertText").addClass("bg-success")
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