
// -------------------------------------------
// -- Utility Class/Methods

function Util() {}


Util.byId = function( elementId ){
	return jQuery( "#" + elementId );
};

Util.disableTag = function( tag, isDisable )
{
	tag.prop('disabled', isDisable);
	if( isDisable )
	{
		tag.css( 'background-color', 'lightGray' )
			.css( 'border-color', 'Gray' )
			.css( 'cursor', 'auto' );
	}
	else
	{
		tag.css( 'background-color', '' )
			.css( 'border-color', '' ).css( 'cursor', '' );
	}
};

// -----------------------------------------------------------------------------------
// List
// ----------

Util.clearList = function( selector ) {
	selector.children().remove();
};


Util.sortByKey = function( array, key, isInt, noCase, emptyStringLast ) {
	return array.sort( function( a, b ) {
		
		var x = a[key]; 
		var y = b[key];

		if( isInt !== undefined && isInt )
		{
			x = eval(x);
			y = eval(y);
		}

		if ( noCase !== undefined && noCase )
		{
			x = x.toLowerCase();
			y = y.toLowerCase();
		}

		if ( emptyStringLast !== undefined && emptyStringLast && ( x == "" || y == "" ) ) 
		{
			if ( x == "" && y == "" ) return 0;
			else if ( x == "" ) return 1;
			else if ( y == "" ) return -1;
		}
		else
		{
			return ( ( x < y ) ? -1 : ( ( x > y ) ? 1 : 0 ) );
		}
	});
};

Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};

Util.getElementByKey = function( json_Data, key, value )
{
	for( var i=0; i<json_Data.length; i++ ){
		var element = json_Data[i];
		if( element[key] == value ){
			return element;
		}
	}
	return "";
};

Util.getFromList = function( list, value, propertyName )
{
	var item;

	// If propertyName being compare to has not been passed, set it as 'id'.
	if ( propertyName === undefined )
	{
		propertyName = "id";
	}

	for( i = 0; i < list.length; i++ )
	{
		var listItem = list[i];

		if ( listItem[propertyName] == value )
		{
			item = listItem;
			break;
		}
	}

	return item;
};

Util.checkDefined = function( input ) {

	if( input !== undefined && input != null ) return true;
	else return false;
};

Util.formatNumber = function( number ){
	return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ----------------------------------
// Date Formatting Related


var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'];

var monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function datePickerInRange( startdateFieldId, endDateFieldId, startFieldDate, endFieldDate )
{
	var s = jQuery("#" + startdateFieldId );
	var e = jQuery("#" + endDateFieldId );
	if( startFieldDate !== undefined ) s.val( startFieldDate );
	if( endFieldDate !== undefined ) e.val( endFieldDate );

	var dates = $('#'+startdateFieldId+', #' + endDateFieldId).datepicker(
		{
			dateFormat: 'yy-mm-dd',
			defaultDate: "+1w",
			changeMonth: true,
			changeYear: true,
			numberOfMonths: 1,
			monthNamesShort: monthNames,
			createButton: false,
			constrainInput: true,
			yearRange: '-100:+100',
			onSelect: function(selectedDate)
			{
				var option = this.id == startdateFieldId ? "minDate" : "maxDate";
				var instance = $(this).data("datepicker");
				var date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
				dates.not(this).datepicker("option", option, date);
			}
		});


	jQuery( ".ui-datepicker-trigger").hide();

	$("#ui-datepicker-div").hide();
}

Util.getCurrentDate = function()
{
	return jQuery.datepicker.formatDate( "yy-mm-dd", new Date() ) ;
};

Util.getDateFromToday = function( numberOfDays )
{
	var date = new Date();
	date.setDate( date.getDate() - numberOfDays );

	return jQuery.datepicker.formatDate( "yy-mm-dd", date ) ;
};

// "2015-09-23 15:05:54.461"
Util.formatDate = function( dateTimeStr )
{
	var arrDateTime = dateTimeStr.split(" ");
	var attDate = arrDateTime[0].split("-");
	var arrTime = arrDateTime[1].split(":");
	var monthIdx = eval(attDate[1]) - 1;

	return attDate[2] + " " + monthShortNames[monthIdx] + " " + attDate[0] + "  " + arrTime[0] + ":" + arrTime[1];
};

// Date Formatting Related
// ----------------------------------

Util.capitalize = function(s)
{
	return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};