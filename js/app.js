window.onload = function(){
    console.log("loaded")
    fillLocations()
    fillDepartments()
    $(document).click(function (event) {
        hideAlert();
    });
}

function clearSearch(){
    $('#searchForm').trigger("reset");
}

function clearCreate(){
    $('#createForm').trigger("reset");
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
    obj.location = $("#locationSearch").val()
    obj.department = $("#departmentSearch").val()
    obj.jobTitle = $("#jobTitleSearch").val()
    console.log(obj)
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
    console.log(id)
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
    console.log(person)
    $("#searchResults").hide()
    $("#entry").show()
    $("#create").hide()
    $("#search").hide()
    $("#recordOutput").empty();
    $("#recordOutput").append( `

        <!--Name-->
        <div class="row w-100 h-100 mx-auto">
            <div class="w-100 h-100 d-flex flex-column">
                <h5 class=" bg-secondary p-0 m-0 text-light">Name</h5>
                <div id="nameRecord" class="d-flex my-auto col justify-content-around">
                    <div></div>
                    <h5 class="my-auto" id="fullName">${person.firstName} ${person.lastName}</h5>
                    <a onclick="editEntry('name')" class="text-primary my-auto" href="#">
                        <h5><i class="fas fa-pencil-alt p-1"></i></h5>
                    </a>
                </div>
                
                <h6 class="mx-auto">ID:${person.id}</h6>

                <div id="nameEdit" class="input-group d-none text-center my-auto">
                <input type="text" id="firstNameEdit" value="${person.firstName}" class="form-control">
                <input type="text" id="lastNameEdit" value="${person.lastName}" class="form-control">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" onclick="updateName(${person.id})" type="button">Update</button>
                </div>
              </div>
              </div>
        </div>




        <!--Email-->
        <div class="row w-100 h-100 mx-auto">
            <div class="w-100 h-100">
                <h5 class="rounded bg-secondary p-0 m-0 text-light">Email</h5>
                <div id="emailRecord" class="d-flex my-auto col justify-content-around">

                <div></div>
                    <h5 class="my-auto text-center"  id="emailDisplay">${person.email}</h5>
                    <a onclick="editEntry('email')" class="my-auto text-primary" href="#">
                        <h5><i class="fas fa-pencil-alt p-1"></i></h5>
                    </a>
                </div>
                <div id="emailEdit" class="input-group d-none my-auto">
                <input type="text" id="emailInput" value="${person.email}" class="form-control">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" onclick="updateEmail('${person.id}')" type="button">Update</button>
                </div>
              </div>
            </div>
        </div>





        <!--Job Title-->
        <div class="row w-100 h-100 mx-auto">
            <div class="w-100 h-100">
                <h5 class="rounded bg-secondary p-0 m-0 text-light">Job Title</h5>
                <div id="jobTitleRecord" class="d-flex col justify-content-around">

                <div></div>
                    <h5 id="jobTitleDisplay">${person.jobTitle}</h5>
                    <a onclick="editEntry('jobTitle')" class="text-primary" href="#">
                        <h5><i class="fas fa-pencil-alt p-1"></i></h5>
                    </a>
                </div>
                <div id="jobTitleEdit" class="input-group d-none">
                <input type="text" id="jobTitleInput" value="${person.jobTitle}" class="form-control">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" onclick="updatejobTitle('${person.id}')" type="button">Update</button>
                </div>
              </div>
            </div>
        </div>





        <!--Department-->
        <div class="row w-100 h-100 mx-auto">
            <div class="w-100 h-100">
                <h5 class="rounded bg-secondary p-0 m-0 text-light">Department</h5>
                <div id="departmentRecord" class="d-flex col justify-content-around">

                <div></div>
                    <div>
                        <h5 class="text-center" id="departmentDisplay">${person.departmentName}</h5>
                        <p class="text-center" id="locationDisplay">\(${person.locationName}\)</p>
                    </div>
                    <a onclick="editEntry('department')" class="text-primary" href="#">
                        <h5><i class="fas fa-pencil-alt p-1"></i></h5>
                    </a>
                </div>
                <div id="departmentEdit" class="input-group d-none">
                    <select type="text" id="departmentInput" value="${person.departmentName}" class="form-control"></select>
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" onclick="updateDepartment('${person.id}')" type="button">Update</button>
                </div>
              </div>
            </div>
        </div>


        <div class="d-flex justify-content-around">
        <button  data-toggle="modal" data-target="#deleteModal" class="btn btn-danger w-100">DELETE</button>
        <button onclick="saveEntry(${person.id})" type="button" data-toggle="collapse" data-target="#collapseAlert" aria-expanded="false" aria-controls="collapseAlert" class="btn btn-primary w-100">SAVE</button>
        </div>



        <!--Delete Modal-->
        <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel" data-toggle="modal" data-target="#deletedModal">Delete ${person.firstName} ${person.lastName}?</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-footer">
                <button type="button" onclick="deleteEntry(${person.id})" class="btn btn-danger" data-dismiss="modal" type="button">DELETE</button>
                <button type="button"  class="btn btn-secondary" data-dismiss="modal">CANCEL</button>
              </div>
            </div>
          </div>
        </div>



    `)
    $("#departmentInput").html($("#departmentSearch").html())
    $("#departmentInput").val(person.departmentID)
}

function deleteEntry(id){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'deleteEntry', arguments: [id]},
        success: (obj)=>{
            console.log(obj)
            searchClicked()
            $("#alertText").text("Entry Deleted")
            $("#alertText").addClass("bg-danger")

        },
        error: (err)=>{console.log(err.responseText)}
    })
}

function saveEntry(id){
    person = {}
    person.id = id
    person.firstName = $("#firstNameEdit").val()
    person.lastName = $("#lastNameEdit").val()
    person.email = $("#emailInput").val()
    person.jobTitle = $("#jobTitleInput").val()
    person.departmentID = $("#departmentInput").val()

    console.log(person)

    updatePerson(person)


}

function updatePerson(person){
    jQuery.ajax({
        type: "POST",
        url: 'php/companydir.php',
        dataType: 'json',
        data: {functionname: 'updateAll', arguments: [person]},
        success: (obj)=>{
            console.log(obj)
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
    $(`#${elem}Edit`).removeClass("d-none")
    $(`#${elem}Record`).hide()
    $(`#${elem}Record`).removeClass("d-flex")
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
            console.log(obj)
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
            console.log(obj)
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
            console.log(obj)
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
            console.log(obj)
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
    console.log(departmentID)
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
    console.log(res)
    

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
             ${record.departmentName}
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

            })
        },
        error: (er)=>{console.log(er)}
        
    })
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
    console.log(obj)
    console.log(emailRegex.test(obj.email))
    errArr=[]
    if ((obj.firstName=="") ||  (obj.lastName=="")){
        errArr.push("Must Enter First and Last Name")
    } 
    if (obj.email=="" || (emailRegex.test(obj.email) == false)){
        errArr.push("Must enter valid email")
    }
    if (obj.departmentID == ""){
        errArr.push("Must choose a department")
    }

    if(errArr !=[]){
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
            console.log(obj)
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
