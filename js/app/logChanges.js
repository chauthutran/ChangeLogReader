/**
 * Created by Tran on 8/5/2015.
 */

function LogChange_UI( _logChange_DM, _period_UI )
{
    var me = this;

    me.logChange_DM = _logChange_DM;
    me.period_UI = _period_UI;
    me.ouLevelTag = Util.byId("ouLevel");
    me.periodTypeTag = Util.byId("periodType");
    me.periodListTag = Util.byId("periodList");
    me.fromDateTag = Util.byId("fromDate");
    me.toDateTag = Util.byId("toDate");
    me.logChangesDiv = Util.byId("logChangesDiv");
    me.logChangesTableTag = Util.byId("logChangesTable");
    me.logChangesTB = Util.byId("logChangesTB");
    me.loaderDiv = Util.byId("loaderDiv");
    me.progressInfoTag = Util.byId("progressInfo");
    me.grandParentSelectionRadio = Util.byId("grandParentSelection");
    me.individualSelectionRadio = Util.byId("individualSelection");
    me.searchResultTag = Util.byId("searchResult");

    me.tableData = [];
    me.tableDataValues = [];

    me.initialSetup = function()
    {
        var colOU = me.getTableColByIdx(0);
        var colDE =  me.getTableColByIdx(1);
        var colValue = me.getTableColByIdx(2);
        var colStatus = me.getTableColByIdx(3);
        var colDate = me.getTableColByIdx(4);
        var colWho = me.getTableColByIdx(5);

        colOU.click( function(){
            me.sortTable($(this));
        });

        colDE.click( function(){
            me.sortTable($(this));
        });

        colValue.click( function(){
            var colStatus =  me.getTableColByIdx(3);
            var colDate = me.getTableColByIdx(4);
            var colWho = me.getTableColByIdx(5);

            colStatus.attr("sorted","unsorted");
            colStatus.find("img").attr( "src", "img/unsorted.gif" );

            colDate.attr("sorted","unsorted");
            colDate.find("img").attr( "src", "img/unsorted.gif" );

            colWho.attr("sorted","unsorted");
            colWho.find("img").attr( "src", "img/unsorted.gif" );

            me.sortTable($(this));
        });

        colStatus.click( function(){
            var colValue = me.getTableColByIdx(2);
            var colDate = me.getTableColByIdx(4);
            var colWho = me.getTableColByIdx(5);

            colValue.attr("sorted","unsorted");
            colValue.find("img").attr("src", "img/unsorted.gif");

            colDate.attr("sorted","unsorted");
            colDate.find("img").attr( "src", "img/unsorted.gif" );

            colWho.attr("sorted","unsorted");
            colWho.find("img").attr( "src", "img/unsorted.gif" );

            me.sortTable($(this));
        });

        colDate.click( function(){
            var colValue = me.getTableColByIdx(2);
            var colStatus =  me.getTableColByIdx(3);
            var colWho = me.getTableColByIdx(5);

            colValue.attr("sorted","unsorted");
            colValue.find("img").attr("src", "img/unsorted.gif");

            colStatus.attr("sorted","unsorted");
            colStatus.find("img").attr( "src", "img/unsorted.gif" );

            colWho.attr("sorted","unsorted");
            colWho.find("img").attr( "src", "img/unsorted.gif" );

            me.sortTable($(this));
        });

        colWho.click( function(){
            var colValue = me.getTableColByIdx(2);
            var colStatus =  me.getTableColByIdx(3);
            var colDate = me.getTableColByIdx(4);

            colValue.find("img").attr("src", "img/unsorted.gif");
            colStatus.find("img").attr( "src", "img/unsorted.gif" );
            colDate.find("img").attr( "src", "img/unsorted.gif" );

            me.sortTable($(this));
        });
    };

    me.sortTable = function( item )
    {
        me.logChangesTB.find('tr').remove();

        // Get Sort Attr of selected Column
        var sortedAttr = item.attr("sorted");
        var sorted = "";
        if( sortedAttr == 'unsorted' ){
            sorted = 'asc';
        }
        else
        {
            sorted = ( sortedAttr == 'asc') ? 'desc' : 'asc';
        }

        // Set img for selected Column
        item.attr( "sorted", sorted );
        item.find("img").attr( "src", "img/" + sorted + ".gif" );

        me.generateTable();
    };

    me.runLogChange = function( ouList, startDate, endDate, peStartDate, peEndDate ) {
        me.loaderDiv.show();
        me.progressInfoTag.html("Retrieving data");
        me.logChangesDiv.hide("fast");
        me.logChangesTB.find('tr').remove();
        me.orgunitNo = ouList.length;
        me.ouIdx = 0;
        me.tableData = [];
        me.tableDataValues = [];
        var individual = Util.byId("grandParentSelection").prop("checked");

        for (var i = 0; i < ouList.length; i++) {
            var ouId = ouList[i].id;
            me.logChange_DM.loadLogChange(individual, ouId, startDate, endDate, peStartDate, peEndDate
                , function ( data ) {
                    me.tableDataValues.push( data.listGrid.rows );
                } ,function( data )
                {
                    me.ouIdx++;
                    if( me.ouIdx == me.orgunitNo )
                    {
                        for( var i=0; i<me.tableDataValues.length; i ++ ){
                            var rows = me.tableDataValues[i];
                            for( var j=0; j<rows.length; j++ )
                            {
                                me.tableData.push( rows[j] );
                            }
                        }

                        me.tableData = me.sortJsonData( me.tableData );
                        me.generateTable();

                        var ouRowNo = me.tableData.length;
                        if( ouRowNo == 0 ){
                            me.searchResultTag.html( "No data value found.");
                        }
                        else{
                            me.searchResultTag.html( "There are " + me.tableData.length + " Org Units with data values found.");
                        }

                        me.loaderDiv.hide();
                        me.logChangesDiv.show("fast");

                        me.logChangesTB.find("img").hide();

                    }
                }
            );
        }
    };

    me.getTableColByIdx = function( colIdx )
    {
        return me.logChangesTableTag.find("th:nth(" + colIdx + ")");
    };


    me.getSortedValue = function( colIdx )
    {
        return me.getTableColByIdx(colIdx).attr("sorted");
    };

    me.generateTable = function()
    {
        var sortedOu = me.getSortedValue( 0 );
        var sortedDE = me.getSortedValue( 1 );
        var sortedVal = me.getSortedValue( 2 );
        var sortedStatus = me.getSortedValue( 3 );
        var sortedDate = me.getSortedValue( 4 );
        var sortedWho = me.getSortedValue( 5 );

        // Clone ouList
        var ouList = JSON.parse(JSON.stringify(me.tableData));

        // Sort Orgunit List
        if( sortedOu=='desc'){
            ouList = ouList.reverse();
        }

        // Sort DEs and Data List

        var rowNo = ouList.length;
        for (var i = 0; i < rowNo; i++) {
            var de = ouList[i].de;
            if (sortedDE == "desc") {
                de = de.reverse();
            }

            for (var j = 0; j < de.length; j++)
            {
                var dataList = de[j].data;

                if( sortedVal != "unsorted" ) {
                    dataList = Util.sortByKey(dataList, "value", dataList[0].deTypeInt );
                    if( sortedVal == "desc" ) {
                        dataList = dataList.reverse();
                    }
                }
                else if( sortedStatus != "unsorted" ) {
                    dataList = Util.sortByKey(dataList, "status");
                    if( sortedStatus == "desc" ) {
                        dataList = dataList.reverse();
                    }
                }
                else if( sortedDate != "unsorted" ) {
                    dataList = me.sortDateListDesc( dataList );
                    if( sortedDate == "asc" ) {
                        dataList = dataList.reverse();
                    }
                }
                else if( sortedWho != "unsorted" ) {
                    dataList = Util.sortByKey(dataList, "who");
                    if( sortedWho == "desc" ) {
                        dataList = dataList.reverse();
                    }
                }

                de[j].data = dataList;
                ouList[i].de[j] = de[j];
            }
            me.generateRowTable( ouList[i] );
        }

        me.logChangesTB.find("img").hide();
    };

    me.generateRowTable = function( ouData )
    {
        var ouName = ouData.name;
        var deList = ouData.de;

        var ouRowNo = 0;

        for( var i=0; i<deList.length; i++ ) {
            ouRowNo += deList[i].data.length;
        }

        for( var i=0; i<deList.length; i++ )
        {
            var de = deList[i];
            var deName = de.name;
            var data = de.data;

            for (var j = 0; j < data.length; j++) {
                var idx = me.logChangesTB.find("tr").length;
                var bgColor = ( idx % 2 == 0 ) ? "" : "#f9f9f9";

                var rowTag = $("<tr></tr>");

                if( ouName!= "" ){
                    rowTag.append("<td rowspan='" + ouRowNo + "' style='vertical-align:top;'>" + ouName + "</td>");
                    ouName = "";
                }

                if( deName != "" ){
                    rowTag.append("<td rowspan='" + data.length + "' style='vertical-align:top;'>" + deName + "</td>");
                    deName = "";
                }

                var value = data[j].value;
                if( value == null )
                {
                    value = "";
                }
                else if( data[j].deTypeInt ) {
                    value = me.formatValue( value );
                }
                rowTag.append("<td align='right' style='background-color: " + bgColor + "'>" + value + "</td>");
                rowTag.append("<td style='background-color: " + bgColor + "'>" + data[j].status + "</td>");
                rowTag.append("<td style='background-color: " + bgColor + "'>" + Util.formatDate( data[j].created ) + "</td>");
                rowTag.append("<td style='background-color: " + bgColor + "' name='" + data[j].who + "' title='This user does not exist in the system any more.'>"+ data[j].who + "</td>" );
                me.logChangesTB.append(rowTag);

                me.logChange_DM.loadUserDetails( data[j].who, function( json_Data ){
                    if( json_Data.users.length > 0 ) {
                        var username = json_Data.users[0].userCredentials.username;
                        var cell = $("td[name='" + username + "'");
                        cell.attr("title", me.setUserDetails(json_Data));
                    }
                });

            }
        }
    };

    me.formatValue = function( value )
    {
        var partValues = value.split(".");
        var part1 = Util.formatNumber( partValues[0] );

        if( partValues.length == 2 )
        {
            value = part1 + "." + partValues[1];
        }
        else{
            value = part1;
        }
        return value;
    };

    me.setUserDetails = function( json_Data ) {
        var user = json_Data.users[0];
        var details = "Full name : " + user.name + "\n";

        var email = ( user.email !== undefined ) ? user.email : "[No defined]";
        details += "Email : " + email + "\n";

        details += "Data Capture Org Unit : ";
        if ( user.organisationUnits.length == 0 )
        {
            details += "[No defined]";
        }
        else
        {
            for (var i = 0; i < user.organisationUnits.length; i++) {
                details += user.organisationUnits[i].name + "; ";
            }
            details = details.substring(0, details.length - 2);
        }
        return details;
    };

    me.sortDateListDesc = function( dateList )
    {
        var curData;
        var result = [];
        for( var i=0; i<dateList.length; i++ )
        {
            var data = dateList[i];
            if( data.status == "Current value" ){
                curData = data;
            }
            else
            {
                result.push( data );
            }
        }

        result = Util.sortByKey( result, "created" );
        result = result.reverse();
        if( curData != undefined ){
            result.insert(0, curData);
        }

        return result;
    };

    me.sortJsonData = function( json_Data )
    {
        var rows = json_Data;
        var arrOU = [];

        for( var i=0; i<rows.length; i++ )
        {
            var cell = rows[i];
            var ouName = cell[0];
            var deName = cell[1];
            var status =  cell[3];
            if( status=="DELETE" || status=="UPDATE" ) {
                status = Util.capitalize(status) + "d";
            }

            var value = ( cell[2] == "null" ? "" : cell[2] );
            var deTypeInt = ( cell[6]=='int' );
            var data = {
                "value": value,
                "status": status,
                "created": cell[4],
                "who": cell[5],
                "deTypeInt": deTypeInt
            };

            var orgunit = Util.getElementByKey( arrOU, "name", ouName );

            // New orgunit
            if( orgunit == "" ) {
                orgunit = {};
                orgunit["name"] = ouName;

                var de = {};
                de["name"] = deName;
                de["data"] = [];
                de["data"].push( data );

                orgunit["de"] = [];
                orgunit["de"].push( de );

                arrOU.push( orgunit );
            }
            else
            {
                var de = Util.getElementByKey( orgunit["de"], "name", deName );

                if( de == "")
                {
                    de = {};
                    de["name"] = deName;
                    de["data"] = [];
                    de["data"].push( data );

                    orgunit["de"].push( de );
                }
                else{
                    de["data"].push( data );
                }
            }
        }

        return arrOU;
    }
}

function LogChange_DM()
{
    var me = this;
    me.PARAM_OU_ID = "@OU_ID";
    me.PARAM_START_DATE = "@START_DATE";
    me.PARAM_END_DATE = "@END_DATE";
    me.PARAM_START_PERIOD_DATE = "@PERIOD_START_DATE";
    me.PARAM_END_PERIOD_DATE = "@PERIOD_END_DATE";
    me.PARAM_SQL_VIEW_UID = "@SQL_VIEW_UID";
    me.PARAM_USERNAME = "@USERNAME";
    me.PARAM_GRAND_PARENT_OU_SQL_VIEW_UID = "wwniq1qIkM0";
    me.PARAM_INDIVIDUAL_OU_SQL_VIEW_UID = "gSk0W8fkuMg";

    me._queryURL_User_Details = _queryURL_api + "users.json?filter=userCredentials.code:eq:" + me.PARAM_USERNAME + "&fields=name,email,organisationUnits[name],userCredentials[username]";

    me._queryURL_View_Log_Change = _queryURL_api + "sqlViews/" + me.PARAM_SQL_VIEW_UID + "/data.json?paging=false&var=entityUID:" + me.PARAM_OU_ID
    + "&var=startDate:" + me.PARAM_START_DATE
    + "&var=endDate:" + me.PARAM_END_DATE
    + "&var=peStartDate:" + me.PARAM_START_PERIOD_DATE
    + "&var=peEndDate:" + me.PARAM_END_PERIOD_DATE;

    me.loadLogChange = function( individual, ouId, startDate, endDate, peStartDate, peEndDate, returnFunc, doneFunc )
    {
        var sqlViewUID = ( individual )?  me.PARAM_GRAND_PARENT_OU_SQL_VIEW_UID : me.PARAM_INDIVIDUAL_OU_SQL_VIEW_UID;
        var url = me._queryURL_View_Log_Change.replace( me.PARAM_OU_ID, ouId );
        url = url.replace( me.PARAM_START_DATE, startDate);
        url = url.replace( me.PARAM_END_DATE, endDate );
        url = url.replace( me.PARAM_START_PERIOD_DATE, peStartDate );
        url = url.replace( me.PARAM_END_PERIOD_DATE, peEndDate );
        url = url.replace( me.PARAM_SQL_VIEW_UID, sqlViewUID );


        RESTUtil.getAsyncData( url
            ,function(json)
            {
                returnFunc(json);
            }
            , function(){}
            , function(){}
            , function( data ){
                doneFunc( data );
            }
        );
    };

    me.loadUserDetails = function( username, returnFunc )
    {
        var url = me._queryURL_User_Details.replace( me.PARAM_USERNAME, username );

        RESTUtil.retrieveManager.retrieveData( url
            , function( json_data )
            {
                returnFunc(json_data);
            }
        );
    }
}
