
$('#subtypecomp').hide();
$('#comp1').hide();
$("#comp2").hide();
$('#comp3').hide();
$('#comp4').hide();
$("#box").hide();

function viewbox(){
	$("#box").fadeIn(0);
	
}
$('#complaint').change(function(){
	$('#subtypecomp').fadeIn(0);
	$('#comp1').hide();
	$("#comp2").hide();
	$('#comp3').hide();
	$('#comp4').hide();
	$("#box").hide();
$("#subtypecomp").children().remove();
	if($('#complaint').val()=="Hostel Complaint"){
		$('#subtypecomp').append('<option selected="selected" disabled>Select an Option</option><option>Room Complaint</option><option>Mess Complaint</option><option>Toilet Complaint </option>');
	}
	else if($('#complaint').val()=="Academic Complaint"){
		$('#subtypecomp').append('<option selected="selected" disabled>Select an Option</option><option>Class and Lab Complaint</option><option>Teacher Complaint</option><option>Toilet Complaint</option>');
	}
});
$('#subtypecomp').change(function(){
	$('#comp1').fadeIn(0);
	$("#comp2").hide();
	$('#comp3').hide();
	$('#comp4').hide();
	$("#box").hide();
	$("#comp1").children().remove();
	$("#comp2").children().remove();
	$("#comp3").children().remove();
	$("#comp4").children().remove();

		
	if($('#complaint').val()=="Hostel Complaint"){
		if($('#subtypecomp').val()=="Mess Complaint"){
		$("#comp1").append('<option selected="selected" disabled>Select an Option</option><option>Food Complaint</option><option>Staff Complaint</option><option>Water Complaint</option>');
		}
		else if($('#subtypecomp').val()=="Room Complaint"){
		$("#comp1").append('<option selected="selected" disabled>Select an Option</option><option>Furniture Complaint</option><option>Electrical Complaint</option>');
		}
		else if($('#subtypecomp').val()=="Toilet Complaint"){
		$("#comp1").append('<option selected="selected" disabled>Select an Option</option><option>Hygiene</option><option>Water Complaint</option><option>Fitting Complaint</option>');
		}
	}
	else if($('#complaint').val()=="Academic Complaint"){
		if($('#subtypecomp').val()=="Class and Lab Complaint"){
			$('#comp1').append('<option selected="selected" disabled>Select an Option</option><option>Furniture Complaint</option><option>Others..</option>');
		}
		else if($('#subtypecomp').val()=="Toilet Complaint"){
		$("#comp1").append('<option selected="selected" disabled>Select an Option</option><option>Hygiene</option><option>Water Complaint</option><option>Fitting Complaint</option>');
		}
		else{
	$('#comp1').hide();
			viewbox();
		}
}});
$('#comp1').change(function(){
			$("#comp2").hide();
			$('#comp3').hide();
			$('#comp4').hide();
			$("#box").hide();
				$("#comp2").children().remove();
	$("#comp3").children().remove();
	$("#comp4").children().remove();
	if($('#complaint').val()=="Hostel Complaint"){		
		if($('#subtypecomp').val()=="Mess Complaint"){
			$('#comp2').fadeIn(0);
		if($('#comp1').val()=="Food Complaint"){
			$("#comp2").append('<option selected="selected" disabled>Select an Option</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>');
			}
		else if($('#comp1').val()=="Staff Complaint"){
			$('#comp2').append('<option selected="selected" disabled>Select an Option</option><option>Unresponsive</option><option>Misbehaviour</option><option>Other..</option>');
			}
		else if($('#comp1').val()=="Water Complaint"){
			$('#comp2').append('<option selected="selected" disabled>Select an Option</option><option>Quality Issue</option><option>Shortage</option><option>Other..</option>');
		}
	}
		else if($('#subtypecomp').val()=="Room Complaint"){
			$('#comp2').fadeIn(0);
			
			if($('#comp1').val()=="Furniture Complaint"){
			$("#comp2").append('<option selected="selected" disabled>Select an Option</option><option>Bed</option><option>Table/Chair</option><option>Wardrobe</option>');
				
			
			}
			else if($('#comp1').val()=="Electrical Complaint"){
			$("#comp2").append('<option selected="selected" disabled>Select an Option</option><option>Fan</option><option>TubeLight</option><option>Socket</option>');
			
			}
	}
		else if($('#subtypecomp').val()=="Toilet Complaint"){
		if($('#comp1').val()=="Fitting Complaint"){
			$('#comp2').fadeIn(0);
			$("#comp2").append('<option selected="selected" disabled>Select an Option</option><option>Broken</option><option>Missing</option><option>Not working</option><option>Other..</option>');
		}
		else if($('#comp1').val()=="Water Complaint"){
			$('#comp2').fadeIn(0);
		$('#comp2').append('<option selected="selected" disabled>Select an Option</option><option>Quality Issue</option><option>Shortage</option><option>Other..</option>');
		}
		else{
			viewbox();
		}
				
		}	
	}
	else if($('#complaint').val()=="Academic Complaint"){
	viewbox();	

}});
$('#comp2').change(function(){
	$('#comp4').hide();
	$('#box').hide();		
	$('#comp3').hide();
	$("#comp3").children().remove();
	$("#comp4").children().remove();
	if($('#complaint').val()=="Hostel Complaint"){
		if($('#comp2').val()=="Other.."){
			viewbox();
		}
		else if($("#subtypecomp").val()=="Mess Complaint"){
			if($('#comp1').val()=="Food Complaint")
		{
			$('#comp3').fadeIn(0);
			$('#comp3').append('<option selected="selected" disabled>Select an Option</option><option>Breakfast</option><option>Lunch</option><option>Evening Snacks</option><option>Dinner</option>');
		}
	
		else if($('#comp1').val()=="Staff Complaint"){
			viewbox();
		}}
		else if($('#comp1').val()=="Electrical Complaint"){
			$('#comp3').fadeIn(0);
			$('#comp3').append('<option selected="selected" disabled>Select an Option</option><option>Not Working</option><option>Broken</option><option>Other..</option>');

		}
		else if($('#comp1').val()=="Fitting Complaint"){
			viewbox();
		}



}});
$('#comp3').change(function(){
	$('#comp4').hide();
	$("#comp4").children().remove();	
	$('#box').hide();
	if($('#complaint').val()=="Hostel Complaint"){
		if($('#comp3').val()=="Other.."){
			viewbox();
		}
		else if($('#comp1').val()=="Food Complaint"){
			$('#comp4').fadeIn(0);	
		$('#comp4').append('<option selected="selected" disabled>Select an Option</option><option>Food was not Tasty</option><option>Food was Oily</option><option>Food was Salty</option><option>Other..</option>');
	}
}});
$('#comp4').change(function(){

		$('#box').hide();
	if($('#comp4').val()=="Other.."){
		viewbox();
	}
});
