var timeout = 60;

function loadData() 
{
	const searchParams = new URLSearchParams(window.location.search);
	var station = (searchParams.get('station'));
	var rows = (searchParams.get('rows'));

	setTimeout(function () {
			$.ajax({
				url: "trainData.php",
				type: "GET",
				data: { "station": station, "rows": rows },
				success: function(result) {
					handleResponse(result); 
					timeout = 60000;
				},
				complete: function(){
					if($('#temp').is(':visible'))
					{
						$('#temp').hide();
						$('#wrapper').show();
						timeout = 60000;
					}
					loadData();
				},
				error : function(){
				alert('something went wrong');
			}
		});
	}, timeout);
}

function handleResponse(result)
{
	var data = JSON.parse(result);
	var trainData = data['train'];
	
	$("#header").html("Live Departure Board: " + data['locationName']);
	$("#title").html("Live Departure Board: " + data['locationName']);

	$("#trainTable").html('');
		
	var index;
	
	for (index = 0; index < trainData.length; ++index)
	{
		var borderStyle = '';
		var carriageInfo = ' &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;';
		var etdStyle = 'col-sm-2 text-md-center';
	
		if (index != (trainData.length-1))
		{
			borderStyle = 'border-bottom: 1px solid white;';
		}
		
		if (trainData[index]['carriages'] != '-')
		{
			carriageInfo = ', this train is formed of ' + trainData[index]['carriages'] + ' carriages';
		}
		
		if (trainData[index]['etd'].match(/cancel|delay/i))
		{
			etdStyle = 'col-sm-2 text-md-center DelayedOrCancelled';
		}

		if (trainData[index]['callingPointsString'] === undefined)
		{
			trainData[index]['callingPointsString'] = 'N/A';
		}
		
		var html = `
			<!---TRAIN ROW--> 
			<div class="row">
				<div class="col-sm-1">` + trainData[index]['schd'] + `</div>
				<div class="col-sm-8 TrainDestination">` + trainData[index]['destination'] +`</div>
				<div class="col-sm-1 text-md-center">` + trainData[index]['platform'] + `</div>
				<div class="` + etdStyle + `">` + trainData[index]['etd'] + `</div>
			</div>
			<div  class="row">
			</div>
			<div class="row no-gutters" style="padding-left: 94px;` + borderStyle + `">
				<div class="col-sm-12 col-md-1 trainfont">via:</div>
				<div class="col-sm-8 col-md-8 trainfont">
				  <marquee>` + trainData[index]['callingPointsString'] + `</marquee>
				</div>
				<span class="trainfont">Operated by ` + trainData[index]['toc'] + ``+
				carriageInfo +` </span>
			</div>`;
		
		
		$("#trainTable").append(html);
	}
	
	$("#nrccMessages").html(data['nrccMessages']);
	
}

loadData();
