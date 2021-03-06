jQuery.sap.declare("hss.weather.test.opa.Actions");

jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.opaQunit");

/**
 *  @author  Tanja Weiser
 */

hss.weather.test.opa.Actions = new sap.ui.test.Opa5({
	/**
	 * Searches for control with matching property
	 * @param  {String} viewName      Name of view
	 * @param  {String} controlType   Control Type after which will be searched
	 * @param  {String} name          Property
	 * @param  {String} value         Value of the Property
	 * @return {jQuery.promise} 	  waitFor The jQuery.promise object for event handling
	 */
	iSearchControlWithMatchingProperty: function(viewName, controlType, name, value){
		return this.waitFor({
			viewName: viewName,
			controlType: controlType, //e.g sap.m.Label
			matchers: new sap.ui.test.matchers.PropertyStrictEquals({
				name: name, //e.g. text
				value: value
			}),
			success: function(oControl){
				sap.ui.test.Opa5.assert.ok(true, "Found the Control: (" + oControl + ")");
			},
			errorMessage: "Did not find the control with the property (" + value + ")"
		});
	},

	/**
	 * Searches control by id
	 * @param  {String} id        	Id of Control after which will be searched
	 * @return {jQuery.promise} 	waitFor The jQuery.promise object for event handling
	 */
	iSearchById: function(id){
		return this.waitFor({
			id: new RegExp(id),
			success: function(oControl){
				sap.ui.test.Opa5.assert.ok(true, "Found Control: " + oControl + " with ID: '" + id + "'");
			},
			errorMessage: "Did not find the control with the corresponding ID (" + id + ")"
		});
	},

	/**
	 * CLicks on a control wit a certain id
	 * @param  {String} id 			Id of Control after which will be searched
	 * @return {jQuery.promise}     waitFor The jQuery.promise object for event handling
	 */
	iClickOnControlWithId: function(id){
		return this.waitFor({
			id: new RegExp(id),
			success: function(aControls){
				if(aControls && aControls[0]){
					sap.ui.test.Opa5.assert.ok(true, "Found Control with ID (" + id + ")");
					// aControls[0].$().trigger("tap");
					aControls[0].firePress();
				}
			},
			errorMessage: "Did not find control with matching ID (" + id +")"
		});
	},

	/**
	 * Changes the value of an input
	 * @param  {String} id    		Id of Control after which will be searched
	 * @param  {String} value 		New value
	 * @return {jQuery.promise} 	waitFor The jQuery.promise object for event handling
	 */
	iChangeInputValue: function(id, value){
		return this.waitFor({
			id: new RegExp(id),
			success: function(oInput){
				if(oInput && oInput[0]){
					oInput[0].setValue(value);
					sap.ui.test.Opa5.assert.ok(true, "Found Control with ID (" + id + ") and changed value to " + value );
				}
			},
			errorMessage: "Did not find control with matching ID"
		});
	},

	/**
	 * Checks a radiobutton in a radiogroup with a certain id
	 * @param  {String} id    		Id of Control after which will be searched
	 * @param  {int}    index 		Index of the radiobutton which should be checked
	 * @return {jQuery.promise}		waitFor The jQuery.promise object for event handling
	 */
	iClickOnRadioButtonWithIndex: function(id, index){
		return this.waitFor({
			id: new RegExp(id),
			success: function(aControls){
				if(aControls && aControls[0]){
					sap.ui.test.Opa5.assert.ok(true, "Found Control with ID (" + id + ")");
					aControls[0].fireSelect({selectedIndex: index});
				}
			},
			errorMessage: "Did not find control with matching ID (" + id +")"
		});
	},

	/**
	 * Changes state of a switch with a certain id
	 * @param  {String} id    		Id of Control after which will be searched
	 * @param  {String} state 		State which should be set
	 * @return {jQuery.promise}		waitFor The jQuery.promise object for event handling
	 */
	iChangeStateOfSwitch: function(id, state){
		return this.waitFor({
			id: new RegExp(id),
			success: function(aControls){
				if(aControls && aControls[0]){
					sap.ui.test.Opa5.assert.ok(true, "Found Control with ID (" + id + ")");
					aControls[0].setState(state);
				}
			},
			errorMessage: "Did not find control with matching ID (" + id +")"
		});
	}

});

