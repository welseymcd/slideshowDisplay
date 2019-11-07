    //import "firebase/database"
    var firebaseConfig = {
        apiKey: "AIzaSyAbEIc-8EsuT5-GsRLU9EeyB9ISRMq41-Y",
        authDomain: "photowebapp-8e07e.firebaseapp.com",
        databaseURL: "https://photowebapp-8e07e.firebaseio.com",
        projectId: "photowebapp-8e07e",
        storageBucket: "photowebapp-8e07e.appspot.com",
        messagingSenderId: "1097527464840",
        appId: "1:1097527464840:web:be2929114306571b97203d",
        measurementId: "G-VCRQTD51DP"
      };

    const Firebase = firebase.initializeApp(firebaseConfig);
    const database = Firebase.database();
    var barSeats;
    const imagesRef = database.ref().child("114").child("slideshowImages");
    const barLayoutRef = database.ref().child("114").child("barLayout");

    var currentIndex = 0;
    var slidesSinceBar = 0;
    const barMessage = "<div class=\"header\"><h2 class=\"display-4\">Available Seating At the Bar</h2><br /><h3><small class=\"text-muted\">*Bar seating is first come, first serve*</small></h3></div>";
    const DrawBar = (barSeats) =>{
        var tempBarLayout = document.createElement("div");
        tempBarLayout.className = "container";
        tempBarLayout.innerHTML = barMessage;
        barSeats.forEach((row)=>{
            var tempRow = document.createElement("div");
            tempRow.className = "row";
            console.log(row);
            row.forEach((seatVal)=>{
                var seat = document.createElement("div");
                seat.className = "col-sm";
                
                if(seatVal.type === 0){
                    seat.className += " empty";
                } else {
                    seat.className += " seat";
                    if(seatVal.type===2){
                        seat.className += " topLeft";
                      } else if (seatVal.type === 3){
                          seat.className += " topRight";
                      }
                    if(seatVal.clean) {
                        seat.className += " clean";
                    }
                }

                tempRow.appendChild(seat);
            })
            tempBarLayout.appendChild(tempRow);
        });
        console.log(tempBarLayout);
        $('#barContainer').html(tempBarLayout);
    }
    barLayoutRef.on("value", (snap)=>{
        if(snap.val()){
            barSeats = snap.val();
            DrawBar(barSeats);
        }
    })
    imagesRef.orderByChild("status").equalTo("active").on("value", (snap)=>{
      if(!snap.val()){
        return;
      }
      var images = Object.keys(snap.val()).map((key)=>{
        var image = snap.val()[key];
        var tempImage = new Image();
        tempImage.src = image.url;
        tempImage.className = "slideshow imageNotVisible";
        tempImage.id = key;
        tempImage.onload = ()=>{
          $("#images").append(tempImage);
        }
        return ({
          key: key,
          url: image.url
        })
      });
      console.log(images)
    });

    function cycleItems(){
        var item = $('#images img').eq(currentIndex)
        $('#images img').removeClass("imageVisible").addClass("imageNotVisible");
        item.removeClass("imageNotVisible");
        item.addClass("imageVisible")
    }

    var autoSlide = setInterval(function(){
        if(slidesSinceBar === 0){
            $("#images").css("display", "block");
            $("#barContainer").css("display", "none");
        }
        if(slidesSinceBar === 3){
            slidesSinceBar = 0;
            $("#images").css("display", "none");
            $("#barContainer").css("display", "block");
        } else {
            slidesSinceBar += 1;
            currentIndex += 1;
        }
        if(currentIndex > $('#images img').length){
            currentIndex = 0;
        }
        cycleItems();
    }, 3000)