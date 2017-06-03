var individual = {
    xtype: 'container',
    layout: 'hbox',
    margin: '0 0 10',
    items: [
		{
	        xtype: 'fieldset',
	        flex: 1,
	        title: 'Ingrese los datos',
	        defaultType: 'textfield', 
	        layout: 'anchor',
	        defaults: {
            	anchor: '100%',
            	hideEmptyLabel: false
			},
	        items: [
	        	{
					name: 'name',
					fieldLabel: 'Nombre <span style="color:red">(*)</span>',
					allowBlank: false
				},
				{
					name: 'identification',
					fieldLabel: 'NIT'
				},
				{
					name:  'address',
					fieldLabel: 'Dirección'
				},
				{
					name: 'city',
					fieldLabel: 'Ciudad'
				},
				{
					name: 'phonePrimary',
					fieldLabel: 'Teléfono 1'
				},
				{
					name: 'phoneSecondary',
					fieldLabel: 'Teléfono 2'
				},
				{
					name: 'fax',
					fieldLabel: 'Fax'
				},
				{
					name: 'mobile',
					fieldLabel: 'Celular'
				},
				{
					xtype: 'combobox',
					name: 'priceList',
					fieldLabel: 'Lista de precios',
					emptyText: 'Seleccione',
					editable: false,
					store: ['Ninguno', 'General']
				},
				{
					xtype: 'combobox',
					name: 'seller',
					fieldLabel: 'Vendedor',
					emptyText: 'Seleccione',
					editable: false,
				},
	        ]
    	}, 
	    {
	        xtype: 'component',
	        width: 10
	    }, 
	    {
	        xtype: 'fieldset',
	        flex: 1,
	        title: 'Ingrese los datos',
	        defaultType: 'textfield', // each item will be a radio button
	        layout: 'anchor',
	        defaults: {
	            anchor: '100%',
	            hideEmptyLabel: false
	        },
	        items: [
				{
					xtype: 'combo',
					name : 'term',
					itemId:'contactterm',
					fieldLabel: 'Términos de pago',
					emptyText: 'Seleccione',
	                editable: false,
	                mode: 'remote',
	                /*listeners: {
				    	render : function(field,nval,oval) {
				    		// var combo = Ext.getCmp('contactterm');
	                		field.setValue('2');
				    	}
				    
				    },*/
	            	store: ['Ninguno', 'De contado', '8 días', '15 días', '30 días', '60 días' ]
				},
				{
					xtype: 'checkboxfield',
					name: 'client',
					itemId: 'contactclient',
					fieldLabel: 'Cliente'
				},
				{
					xtype: 'checkboxfield',
					name: 'provider',
					itemId: 'contactprovider',
					fieldLabel: 'Proveedor'
				},
				{
					name: 'internalContacts',
					fieldLabel: 'Contactos internos'
				},
				{
					name: 'email',
					fieldLabel: 'E-mail',
					vtype: 'email'
				},
				{
					xtype: 'textareafield',
					name: 'observations',
					fieldLabel: 'Observación',
					height: 85
				},
	        ]
	    },
	    {
	        xtype: 'component',
	        width: 10
	    }, 
    ]
};

Ext.define('CrudExt.view.contact.Form', {
	extend: 'Ext.form.Panel',
	autoScroll: true,
	requires: ['Ext.form.Field'],
	defaultType: 'textfield',
	defaults: {
		//allowBlank: false,
		labelAlign: 'left',
		labelWidth: 400
	},
	alias: 'widget.contactform',
	padding: 5,
	style: 'background-color: #fff; ',
	border: false,
    bodyPadding: 10,

	initComponent: function(){

		this.items = [
			individual, 
			Ext.create('Ext.grid.Panel', {
			    title: 'Contactos Internos',
			    xtype: 'inernalcontactgrid',
			    itemId: 'inernalcontactgrid',
			    store: [
				    {
				    	internal_id: '',
				    	internal_name: '',
						internal_lastName: '',
						internal_email: '',
						internal_phone: '',
						internal_mobile: '',
						internal_sendNotifications: ''
				    }
			    ],
			    columns: [
				    {
				        text: 'Nomnbre',
				        dataIndex: 'internal_name',
				        flex: 1,
				        editor: 'textfield'
				    },
				    {
				        text: 'Apellido',
				        dataIndex: 'internal_lastName',
				        flex: 1,
				        editor: 'textfield'
				    },
				    {
				        text: 'Correo',
				        dataIndex: 'internal_email',
				        flex: 1,
				        editor: 'textfield'
				    },
				    {
				        text: 'Teléfono',
				        dataIndex: 'internal_phone',
				        flex: 1,
				        editor: 'textfield'
				    },
				    {
				        text: 'Celular',
				        dataIndex: 'internal_mobile',
				        flex: 1,
				        editor: 'textfield'
				    },
				    {
				        text: 'Enviar notificación',
				        dataIndex: 'internal_sendNotifications',
				        flex: 1,
				        editor: 'checkboxfield'
				    },
			    ],

			    selType: 'cellmodel',
			    plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1
			        })
			    ],
			    height: '100%',
			    width: '100%',
			})
		];

		this.bbar = [
			{
				text: 'Guardar',
				action: 'save',
				itemId: 'salvar',
				iconCls: 'save'
			},
			{
				text: 'Cancelar',
				action: 'cancel',
				itemId: 'cancelar',
				iconCls: 'cancel',
				handler: function(){
					this.up('window').close();
				}
			},
			{
				text: 'Asociar Persona',
				action: 'associate',
				itemId: 'associate',
			},
		];
			
		this.callParent(arguments);
	}
});