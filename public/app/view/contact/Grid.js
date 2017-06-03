Ext.define('CrudExt.view.contact.Grid',{
	extend: 'Ext.grid.Panel',
	title: 'Lista de Contactos',
	itemId: 'contactGrid',
	xtype: 'contactgrid',
	store : 'Contacts',
	stripeRows: true,
    columnLines: true,
	initComponent: function(){

		this.columns = [
			{ header: 'Nombre',  dataIndex: 'name', width: '20%' },
	        { header: 'NIT', dataIndex: 'identification', width: '20%'},
	        { header: 'Teléfono 1', dataIndex: 'phonePrimary', width: '20%' },
	        { header: 'Observaciones', dataIndex: 'observations', width: '30%' },
	        {
		        xtype: 'actioncolumn',
		        text: 'Ver',
		        width: '10%',
		        align: 'center',
		        items: [{
		            icon   : 'https://cdn1.alegra.com/images/icons/zoom.png', 
		            tooltip: 'Visualizar',
		            handler: function(view, rowIndex, colIndex, item, e, record, row) {
		                location.href = 'index/find?id=' + record.data.id;
		            }
		        }]
			}
		];

		this.dockedItems = [
			{
				xtype: 'toolbar',
				dock: 'top',
				items: [
					{
						xtype: 'button',
						text: 'Agregar',
						iconCls: 'add',
						action: 'add'
					},
					{
						text: 'Eliminar',
						iconCls: 'delete',
						action: 'delete'
					},
					{
						text: 'Modificar',
						iconCls: 'edit',
						action: 'edit'
					},
					{
	                   
                        xtype: 'textfield',
                        itemId: 'searchBar',
	                    cls: 'search-bar',
	                    width: 230,
	                    margin: '0 0 0 10',
	                },
	                {
						text: 'Buscar por nombre',
						iconCls: 'show',
						action: 'all'
					},
				]
			},
			{
		        xtype: 'pagingtoolbar',
		        store: 'Contacts',
		        dock: 'bottom',
		        displayInfo: true
		    }
		];

		this.callParent(arguments);
	}

});