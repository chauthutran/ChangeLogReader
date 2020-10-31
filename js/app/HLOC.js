/**
 * Created by Tran on 8/5/2015.
 */

jQuery(document).ready(function()
{
    var app = new HLOC();
    app.initialSetup();
});

// ------------------------------------
// *** DHIS AppStore Deploy Version ***
// -- App Manifest Json (Get this via Synch, so that it is defined ahead)
var _appManifest = $.parseJSON( RESTUtil.getSynchData( 'manifest.webapp' ) );
// -- URLs
var _appURL = _appManifest.activities.dhis.href.replace( '/dhis-web-maintenance-appmanager', '' ) + '/';
// ------------------------------------

var _queryURL_api = _appURL + 'api/';

function HLOC()
{
    var me = this;

    me.orgunit_UI;
    me.period_UI;
    me.logChange_UI;

    me.ouLevelTag = Util.byId("ouLevel");
    me.runBtnTag = Util.byId("runBtn");
    me.periodListTag = Util.byId("periodList");
    me.fromDateTag = Util.byId( 'fromDate' );
    me.toDateTag = Util.byId( 'toDate' );

    me.closeButtonTag = $("[name='closeButton']");
            

    // Main 'Run' button action.

    me.initialSetup = function()
    {
        new Header();
        me.initializeObjects();
        datePickerInRange( "fromDate", "toDate", Util.getDateFromToday(1) , Util.getCurrentDate() );

        me.setup_Event();
    };

    me.initializeObjects = function()
    {
        me.orgunit_UI = new OrgUnit_UI();
        me.period_UI = new Period_UI( new Period_DM() );
        me.logChange_UI = new LogChange_UI( new LogChange_DM(), me.period_UI );

        me.orgunit_UI.initialSetup();
        me.period_UI.initialSetup();
        me.logChange_UI.initialSetup();
    };

    me.setup_Event = function()
    {
        me.closeButtonTag.click( function(){
            window.location.href = _appURL;
        });
        
        me.runBtnTag.click(function(){
            var ouList = me.orgunit_UI.selected;

            var periodStartDate = me.period_UI.getPeriodStartDate();
            var peStartDate = me.period_UI.getDateParam( periodStartDate );

            var periodEndDate = me.period_UI.getPeriodEndDate();
            var peEndDate =  me.period_UI.getDateParam( periodEndDate );

            var startDate = me.period_UI.getDateParam( me.fromDateTag.val() );
            var endDate =  me.period_UI.getDateParam( me.toDateTag.val() );

            me.logChange_UI.runLogChange( ouList, startDate, endDate, peStartDate, peEndDate );
        });

        me.periodListTag.change(function(){
            me.disableRunBtn();
        });

        me.fromDateTag.change(function(){
            me.disableRunBtn();
        });

        me.toDateTag.change(function(){
            me.disableRunBtn();
        });

    };

    me.disableRunBtn = function()
    {
        if( me.orgunit_UI.selected.length>0 && me.periodListTag.val()!=null && me.periodListTag.val()!="" && me.fromDateTag.val() != "" &&  me.toDateTag.val() != "" )
        {
            Util.disableTag( me.runBtnTag, false );
        }
        else
        {
            Util.disableTag( me.runBtnTag, true );
        }
    };

}