function flifo(data) {

	if(data.names.length > 1){
		data.names[0] = data.names[0] + " & " + (data.names.length - 1) + " Other(s)";
	}

    document.getElementById("flightInfo").innerHTML = `<div class="flight">
				<div class="fs-header">
					<div class="h4">
						<div class="fs-header-ico fas fa-plane"></div>
						<span>Flight Information &nbsp;</span>
						<span>-&nbsp; ` + data.departing_date + `</span>
					</div>
				</div>
				<div class="fs-content">
					<div class="fs-right">
						<div class="fs-row fs-departure">
							<div class="fs-row__ico fas fa-plane-departure"></div>
							<div class="fs-row__time">` + data.departing_time + `</div>
							<div class="fs-row__airport">` + data.departing_airport + `</div>
							<div class="fs-confirmed fs-subtitle">` + data.departing_confirmed + `</div>
							<div class="fs-duration">` + data.flight_duration + `</div>
						</div>
						<div class="fs-row fs-arrival">
							<div class="fs-row__ico fas fa-plane-arrival"></div>
							<div class="fs-row__time">` + data.arrival_time + `</div>
							<div class="fs-row__airport">` + data.arrival_airport + `</div>
							<div class="fs-subtitle">` + data.arrival_confirmed + `</div>
						</div>
						<div class="fs-left">
							<img alt="Abhioxic" height="26" width="26" src="https://www.gstatic.com/flights/airline_logos/32px/6E.png" class="fs-flight__ico"/>
						</div>
						<div class="flight-status">
							<div class="flight-status__title">` + data.flight_name + ` ` + data.flight_code + ` - ` + data.flight_class + `</div>
							<div class="fs-subtitle">PNR is ` + data.pnr + ` &middot; ` + data.names[0] + `</div>
							<div class="fs-subtitle">` + data.flight_others + `</div>
						</div>
					</div>
				</div>
				<div class="fs-footer">
					<div class="fs-footer from">
					</div>
					<div class="fs-footer from">
					</div>
					<div class="fs-footer from">
					</div>
				</div>
				<div class="stripes"></div>
				<div class="stripes-bottom"></div>
				<div class="footer"></div>
				<div class="header"></div>
			</div>`;
}