function flifo(data){
	if(data.flightDetails.length == 1){
		switch(data.flightDetails[0].airline){
			case "AI":
				flightIco = "./abhi/AirIndia.png";
				break;
			case "9W":
				flightIco = "./abhi/JetAirways.png";
				break;
			case "6E": 
				flightIco = "https://www.gstatic.com/flights/airline_logos/32px/6E.png";
				break;
			case "IX":
				flightIco = "./abhi/AirIndiaExpress.png";
				break;
			case "SG":
				flightIco = "./abhi/SpiceJet.png";
				break;
			case "G8":
				flightIco = "https://image3.mouthshut.com/images/imagesp/925052736s.png";
				break;
			case "I5":
				flightIco = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/32px-AirAsia_New_Logo.svg.png";
				break;
			case "UK":
				flightIco = "./abhi/Vistara.png";
				break;
			default:
				flightIco = "./abhi/DefaultAirline.png";
		}
		var flightDetails = data.flightDetails[0];
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
										<div class="single-fs-confirmed fs-subtitle">` + flightDetails.departDate + `</div>
										<div class="single-fs-duration">` + flightDetails.via + `</div>
									</div>
									<div class="single-fs-row fs-arrival">
										<div class="single-fs-row__ico fas fa-plane-arrival"></div>
										<div class="single-fs-row__time">` + flightDetails.arrivalTime + `</div>
										<div class="single-fs-row__airport">` + flightDetails.destination + `</div>
										<div class="single-fs-subtitle">` + flightDetails.arrivalDate + `</div>
									</div>
									<div class="single-fs-left">
										<img alt="Abhioxic" height="36" width="36" src="`+ flightIco +`" class="fs-flight__ico"/>
									</div>
									<div class="single-flight-status">
										<div class="single-flight-status__title">` + flightDetails.airlineName + `</div>
										<div class="single-fs-subtitle">PNR is ` + flightDetails.airlinePnr + ` &middot; ` + flightDetails.passengers[0] + paxOther + `</div>
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
					flightIco = "./abhi/AirIndia.png";
					break;
				case "9W":
					flightIco = "./abhi/JetAirways.png";
					break;
				case "6E": 
					flightIco = "https://www.gstatic.com/flights/airline_logos/32px/6E.png";
					break;
				case "IX":
					flightIco = "./abhi/AirIndiaExpress.png";
					break;
				case "SG":
					flightIco = "./abhi/SpiceJet.png";
					break;
				case "G8":
					flightIco = "https://image3.mouthshut.com/images/imagesp/925052736s.png";
					break;
				case "I5":
					flightIco = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/32px-AirAsia_New_Logo.svg.png";
					break;
				case "UK":
					flightIco = "./abhi/Vistara.png";
					break;
				default:
					flightIco = "./abhi/DefaultAirline.png";
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