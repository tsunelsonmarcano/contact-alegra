Ext.define('CrudExt.controller.Contact',{
	extend: 'Ext.app.Controller',
	views: ['contact.Grid', 'contact.Form', 'contact.Window'],
	models: ['Contact'],
	stores: ['Contacts'],
	refs: [
        {
            ref: 'list',
            selector: 'contactgrid'
        }
    ],

    /**
     * This function load init actions
     */
	init: function(){
		this.control({
            'contactgrid button[action=edit]': {
                click: this.edit
            },
            'contactgrid': {
                itemdblclick: this.edit
            },
            'contactgrid button[action=add]': {
                click: this.add
            },
            'contactgrid button[action=delete]': {
                click: this.destroy
            },
            'contactform button[action=save]': {
                click: this.save
            },
            'contactgrid button[action=all]': {
                click: this.all
            },
        });
	},

	/**
	 * Open window from record contact
	 */
	add: function(){
		var me = this,
			view = Ext.widget('contactedit');

		view.setTitle('Agregando contacto');
	},

	/**
	 * Filter contact by name
	 */
	all: function() {
		var me = this,
			item = Ext.ComponentQuery.query("#searchBar")[0],
			searchString = item.rawValue,
            grid = me.getList(),
            store = grid.getStore();
          
            store.clearFilter(true);

        if (searchString && searchString != '') {
        	store.filter(searchString);

    	} else {
    		Ext.Msg.alert('Error', 'Debe escribir el nombre del contacto para poder buscar los resultados');
    	}
	},

	/**
	 * Open window from record contact with store data
	 */
	edit: function(btn){
		var me = this,
			grid = me.getList(),
			records = grid.getSelectionModel().getSelection();

		if (records.length === 1) {
			var record = records[0],
				view = Ext.widget('contactedit'),
				form = view.down('contactform').getForm();
			
			form.loadRecord(record);
			view.setTitle('Modificando contacto');

		} else {
			Ext.Msg.alert('Error', 'Más de uma línea seleccionada');
		}	
	},

	/**
	 * Save a new record to Contact model
	 */
	save: function(btn){
		var me = this,
			form = btn.up('contactform'),
			win = form.up('window'),
			basicForm = form.getForm(),
			grid = me.getList(),
			store = grid.getStore(),
			record = basicForm.getRecord(),
			values = basicForm.getValues(),
			internalContacts = [],
		 	inernalcontactgrid = Ext.ComponentQuery.query('#inernalcontactgrid')[0];

		/*
		
		Código para insertar contactos internos desde el gridview

		inernalcontactgrid.getStore().each(function(record) {
		    internalContacts.push({
		    	id : record.data.internal_id,
            	name : record.data.internal_name,
            	lastName : record.data.internal_lastName,
            	email : record.data.internal_email,
            	phone : record.data.internal_phone,
            	mobile : record.data.internal_mobile,
            	sendNotifications : record.data.internal_sendNotifications
		    });
		});

		if (JSON.stringify(internalContacts) === '[{}]') internalContacts = undefined;

		values.internalContacts = internalContacts;*/

		if (basicForm.isValid()) {
			if(!record){
				record = Ext.create('CrudExt.model.Contact');
				record.set(values);
				store.add(record);
			} else {
				record.set(values);
			}

			store.sync();
			win.close();
			location.reload();
		} else {
			Ext.Msg.alert('Error', 'Error al guardar los datos');
		}
	},

	/**
	 * Delete contact
	 */
	destroy: function(){
		var me = this,
			grid = me.getList(),
			store = grid.getStore(),
			records = grid.getSelectionModel().getSelection();

		if (records.length === 0) {
			Ext.Msg.alert('Error', 'Ningua línea seleccionada');
		} else {
			Ext.Msg.show({
                title : 'Confirmar',
                msg : 'Seguro que quiere eliminar los contactos selecionado?',
                buttons : Ext.Msg.YESNO,
                icon : Ext.MessageBox.WARNING,
                scope : this,
                width : 450,
                fn : function(btn, ev){
                    if (btn == 'yes') {
                        store.remove(records);
                        store.sync();
                    }
                }
            });
		}
	}
});