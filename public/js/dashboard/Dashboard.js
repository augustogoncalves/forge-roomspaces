$(document).ready(function () {
    $(document).on('DOMNodeInserted', function (e) {
        if ($(e.target).hasClass('orbit-gizmo')) {
            // to make sure we get the viewer, let's use the global var NOP_VIEWER
            if (NOP_VIEWER === null || NOP_VIEWER === undefined) return;
            new Dashboard(NOP_VIEWER, [
                //new BarChart('Material'),
                //new PieChart('Room_Name'),
                new PieChart('Space_Type')
            ])
        }
    });
})

// Handles the Dashboard panels
class Dashboard {
    constructor(viewer, panels) {
        var _this = this;
        this._viewer = viewer;
        this._panels = panels;

        this._viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, (viewer) => {
            this.adjustLayout();
            setTimeout(function () { _this._viewer.resize() }, 500); _this._viewer.resize();
            _this.loadPanels();
        });
    }

    adjustLayout() {
        // this function may vary for layout to layout...
        // for learn forge tutorials, let's get the ROW and adjust the size of the 
        // columns so it can fit the new dashboard column, also we added a smooth transition css class for a better user experience
        $('#dashboard').remove();
        var row = $(".row").children();
        $(row[0]).removeClass('col-sm-12').addClass('col-sm-8 transition-width').after('<div class="col-sm-4 transition-width" id="dashboard"></div>');
    }

    loadPanels() {
        var _this = this;
        var data = new ModelData(this);
        data.init(function () {
            $('#dashboard').empty();
            _this._panels.forEach(function (panel) {
                // let's create a DIV with the Panel Function name and load it
                panel.load('dashboard', viewer, data);
            });
        });
    }
}
