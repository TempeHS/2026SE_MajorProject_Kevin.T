// prettier-ignore
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyADzNnIA-zf9LSniYX8Z7uAo-VmfsiKz-c",
  v: "weekly",
});

let map;
let infoWindow;

function handleLocationError(browserHasGeolocation, infoWindowInstance, pos) {
  infoWindowInstance.setPosition(pos);
  infoWindowInstance.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed. (Did you allow location access?)"
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindowInstance.open(map);
}

async function init() {
  await google.maps.importLibrary("maps");

  const mapElement = document.querySelector("gmp-map");
  const innerMap = mapElement.innerMap;
  map = innerMap;

  innerMap.setOptions({
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
    },

    // Re-enabled Map/Satellite toggle
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
    },

    streetViewControl: false,
    fullscreenControl: false,
  });

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add(
    "custom-map-control-button",
    "btn",
    "btn-light",
    "btn-sm",
  );

  innerMap.controls[google.maps.ControlPosition.TOP_CENTER].push(
    locationButton,
  );

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(innerMap);
          innerMap.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, innerMap.getCenter());
        },
      );
    } else {
      handleLocationError(false, infoWindow, innerMap.getCenter());
    }
  });

  console.log({ mapElement, innerMap });
}

void init();
