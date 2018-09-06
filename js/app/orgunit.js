/**
 * Created by Tran on 8/5/2015.
 */


function OrgUnit_UI()
{
    var me = this;
    me.selected = [];

    me.selctedOuListTag = Util.byId("selctedOuList");
    me.periodListTag = Util.byId("periodList");
    me.fromDateTag = Util.byId("fromDate");
    me.toDateTag = Util.byId("toDate");
    me.runBtnTag = Util.byId("runBtn");

    me.initialSetup = function(){
        me.buildTree();
    };

    me.buildTree = function()
    {
        selectionTreeSelection.setMultipleSelectionAllowed(true);
        selectionTree.clearSelectedOrganisationUnits();
        selectionTree.buildSelectionTree();

        selectionTreeSelection.setListenerFunction( me.listenerFunction );
    };

    me.listenerFunction = function( orgUnits, orgUnitNames )
    {
        //me.inputTags.orgunitName.val( orgUnitNames[0] );
        me.selected = [];
        var selectedNames = "";
        for( var i=0; i< orgUnits.length; i++) {
            me.selected.push({id: orgUnits[i], name: orgUnitNames[i]});
            selectedNames += orgUnitNames[i] + "; ";
        }

        if( selectedNames != "" ) {
            me.selctedOuListTag.html( selectedNames.substr( 0,selectedNames.length-2 ) );
        }
        else{
            me.selctedOuListTag.html( "[empty]" );
        }

        if( orgUnits.length>0 && me.periodListTag.val()!=null && me.periodListTag.val() != "" && me.fromDateTag.val() != "" &&  me.toDateTag.val() != "" )
        {
            Util.disableTag( me.runBtnTag, false );
        }
        else
        {
            Util.disableTag( me.runBtnTag, true );
        }
    };

    me.getSelected = function()
    {
        return me.selected;
    }

}

