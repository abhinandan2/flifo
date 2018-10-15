function flifo(data){
	if(data.flightDetails.length == 1){
		switch(data.flightDetails[0].airline){
case "AI":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/AirIndia.png";
break;
case "9W":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/JetAirways.png";
break;
case "6E": 
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/Indigo.png";
break;
case "IX":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/AirIndiaExpress.png";
break;
case "SG":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/SpiceJet.png";
break;
case "G8":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/GoAir.png";
break;
case "I5":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/air-asia.png";
break;
case "UK":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/Vistara.png";
break;
default:
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/DefaultAirline.png";
}
		var flightDetails = data.flightDetails[0];
		if(flightDetails.airlinePnr)
			flightDetails.airlinePnr = "PNR is " + flightDetails.airlinePnr + " &middot;";
		else
			flightDetails.airlinePnr = "";
		var paxOther = flightDetails.passengers.length > 1 ? (" & " + (flightDetails.passengers.length - 1) + " Other(s).") : "";
		document.getElementById("flightInfo").innerHTML = `
			    <div class="single-flight">
							<div class="single-fs-header">
								<div class="single-h4">
									Flight Information
								</div>
							</div>
							<div class="single-fs-content">
								<div class="single-fs-right">
									<div class="single-fs-row fs-departure">
										<div class="single-fs-row__ico fas fa-plane-departure"></div>
										<div class="single-fs-row__time">` + flightDetails.departTime + `</div>
										<div class="single-fs-row__airport">` + flightDetails.origin + `</div>
										<div class="single-fs-confirmed">` + flightDetails.departDate + `</div>
										<div class="single-fs-duration single-fs-subtitle">` + flightDetails.via + `</div>
									</div>
									<div class="single-fs-row fs-arrival">
										<div class="single-fs-row__ico fas fa-plane-arrival"></div>
										<div class="single-fs-row__time">` + flightDetails.arrivalTime + `</div>
										<div class="single-fs-row__airport">` + flightDetails.destination + `</div>
										<div class="">` + flightDetails.arrivalDate + `</div>
									</div>
									<div class="single-fs-left">
										<img alt="Abhioxic" height="36" width="36" src="`+ flightIco +`" class="fs-flight__ico"/>
										<div class="single-flight-status__title single-fs-subtitle">` + flightDetails.airlineName + `</div>
									</div>
									<div class="single-flight-status">
										<div class="single-fs-subtitle">` + flightDetails.airlinePnr + flightDetails.passengers[0] + paxOther + `</div>
									</div>
								</div>
							</div>
							<div class="single-footer"></div>
							<div class="single-header"></div>
						</div>
		`
	}	else {
		document.getElementById("flightInfo").innerHTML = `
			<div id="flightInfo">
				<div class="flight">
					<div class="fs-header">
						<div class="h4">
							<div class="fs-header-ico fas fa-plane"></div>
							<span>Flight Information</span>
						</div>
					</div>
					<div class="fs-content">
						<div class="fs-col" id="fs-col">
						</div>
					</div>
					<div class="footer"></div>
					<div class="header"></div>
				</div>
			</div>
		`;
		var index = 1;
		var ribbonIndex = parseInt(data.flightDetails.length / 3);
		data.flightDetails.forEach(flightData => {
			var flightIco = "";
			var ribbon = "";
			var paxOther = ".";
			switch(data.flightDetails[index-1].airline){
case "AI":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/AirIndia.png";
break;
case "9W":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/JetAirways.png";
break;
case "6E": 
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/Indigo.png";
break;
case "IX":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/AirIndiaExpress.png";
break;
case "SG":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/SpiceJet.png";
break;
case "G8":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/GoAir.png";
break;
case "I5":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/air-asia.png";
break;
case "UK":
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/Vistara.png";
break;
default:
flightIco = "https://s3.ap-south-1.amazonaws.com/yatra-images/DefaultAirline.png";
}

			if(data.flightDetails[index-1].passengers.length > 1){
				paxOther = "& " + (data.flightDetails[index-1].passengers.length - 1) + " Other(s).";
			}
			var node = document.createElement("div");
			if(index%2 !== 0){
			// Odd
				var cls = "fs-leg-1";
				node.className = cls;
				var cls_left = "fs-left";
				var flight_status = "flight-status-left";
			}
			else {
				// Even
				if(ribbonIndex-- > 0){
					ribbon = `<div class="ribbon">+1 <span>>></span></div>`;
				}
				var cls = "fs-leg-2";
				node.className = cls;
				var cls_left = "fs-left-2";
				var flight_status = "flight-status-right";
			}
			console.log(flightIco);
			// Prepend "PNR" if airlinePnr is available, else make it empty.
			data.flightDetails[index-1].airlinePnr ? data.flightDetails[index-1].airlinePnr="PNR<br/>"+data.flightDetails[index-1].airlinePnr : data.flightDetails[index-1].airlinePnr="";
			node.innerHTML = ribbon + `
				<div class="fs-row fs-departure">
					<div class="fs-row__time">` + data.flightDetails[index-1].departTime + `</div>
					<div class="fs-row__airport">` + data.flightDetails[index-1].origin + `</div>
					<div class="fs-confirmed fs-subtitle">` + data.flightDetails[index-1].departDate + `</div>
					<div class="fs-duration">` + data.flightDetails[index-1].via + `</div>
				</div>
				<div class="fs-row fs-arrival">
					<div class="fs-row__time">` + data.flightDetails[index-1].arrivalTime + `</div>
					<div class="fs-row__airport">` + data.flightDetails[index-1].destination + `</div>
					<div class="fs-subtitle">` + data.flightDetails[index-1].arrivalDate + `</div>
				</div>
				<div class="`+ cls_left +`">
					<img alt="Abhioxic" height="26" width="26" src="`+flightIco+`" class="fs-flight__ico"/>
					<div class="pnr">`+ data.flightDetails[index-1].airlinePnr+`</div>
				</div>
				<div class="`+ flight_status +`">
					<div class="fs-subtitle">` + data.flightDetails[index-1].passengers[0]+`</div>
					<div class="fs-subtitle">` + paxOther + `</div>
				</div>
			`
			document.getElementById("fs-col").appendChild(node);
			index++;
		});
	};
};