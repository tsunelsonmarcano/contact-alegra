<?php

/**
 * class IndexController
 * 
 * @author Nelson Marcano <[<tsu.nelsonmarcano@gmail.com>]>
 */
class IndexController extends Zend_Controller_Action
{
    /**
     * @var string Uri from the api
     */
    private $_uri;

    /**
     * @var string  
     */
    private $_user;

    /**
     * @var string
     */
    private $_token;

    /**
     * @var Zend_Http_Client
     */
    private $_client;

    /**
     * @var array
     */
    private $_terms;

    /**
     * @var array
     */
    private $_priceList;

    /**
     * Init controller
     */
    public function init()
    {
        $config = Zend_Controller_Front::getInstance()->getParam('bootstrap');
        $alegra = $config->getOption('alegra');
        $this->_uri  = $alegra['uri'];
        $this->_user = $alegra['username'];
        $this->_token = $alegra['token'];

        $this->_client = new Zend_Http_Client();
        $this->_client->setUri($this->_uri);
        $this->_client->setAuth($this->_user, $this->_token);

        $this->_terms = [
            'Ninguno' => '',
            'De contado' => 1,
            '8 días' => 2,
            '15 días' => 3,
            '30 días' => 4,
            '60 días' => 5,
        ];

        $this->_priceList = [ 'Ninguno' => '', 'General' => 1 ];
    }

    /**
     * Main view
     *
     * @return string
     */
    public function indexAction()
    {
        
    }

    /**
     * List all contacts
     *
     * @return json
     */
    public function allAction()
    {
        $this->getHelper('Layout')->disableLayout();
        $this->getHelper('ViewRenderer')->setNoRender();
        $this->getResponse()->setHeader('Content-Type', 'application/json');

        $start = intval($this->_request->getQuery('start'));
        $limit = intval($this->_request->getQuery('limit'));
        $page = intval($this->_request->getQuery('page'));
        $filter = $this->_request->getQuery('filter');

        if (count($filter)) {
            $filter = json_decode($filter);
            $query = trim($filter[0]->property);
            $this->_client->setUri($this->_uri . "?start=$start&limit=$limit&metadata=true&query=$query");
            $response = $this->_client->request();
            $data = $this->_formattData($response->getBody());
            return $this->_helper->json->sendJson([
                'success' => true,
                'results' => $data->metadata->total,
                'data' => $data->data
            ]);
        }


        $this->_client->setUri($this->_uri . "?start=$start&limit=$limit&metadata=true");
        $response = $this->_client->request();
        $data = $this->_formattData($response->getBody());

        return $this->_helper->json->sendJson([
            'success' => true,
            'results' => $data->metadata->total,
            'data' => $data->data
        ]);
    }

    /**
     * Show contact detail
     * @return string
     */
    public function findAction()
    {
        $id = $this->_request->getQuery('id');

        if (empty($id)) {
            throw new \Exception("Error, verifique el id del contacto");
        }

        $this->_client->setUri($this->_uri . '/' . $id);
        $response = $this->_client->request();
        $data = json_decode($response->getBody());

        if (isset($data->code) && $data->code == 404) {
            throw new \Exception($data->message, $data->code);
        }

        $this->view->assign('contactDetail', $data);
    }

    /**
     * Show contact detail in json format
     * @return json
     */
    public function nameAction()
    {
        $id = $this->_request->getQuery('id');

        if (empty($id)) {
            throw new \Exception("Error, verifique el id del contacto");
        }

        $this->_client->setUri($this->_uri . '/' . $id);
        $response = $this->_client->request();
        $data = json_decode($response->getBody());

        if ($data->code == 404) {
            throw new \Exception($data->message, $data->code);
        }
        return $this->_helper->json->sendJson($data);
    }

    /**
     * Create one contact
     * @return json
     */
    public function createAction()
    {
        $this->getHelper('Layout')->disableLayout();
        $this->getHelper('ViewRenderer')->setNoRender();
        $this->getResponse()->setHeader('Content-Type', 'application/json');
       
        $parameters = json_decode($this->_request->getPost('data'));
        if (!isset($parameters->name) || empty($parameters->name)) {
            throw new Exception("Error, el campo nombre es requerido");
        }

        if ( isset($parameters->term) && !empty($parameters->term)) {
            $parameters->term = $this->_terms[$parameters->term];
        }

        if ( isset($parameters->priceList) && !empty($parameters->priceList)) {
            $parameters->priceList = $this->_priceList[$parameters->priceList];
        }

        $response = $this->_client->setRawData( json_encode($parameters) )->request('POST');
        $data = json_decode($response->getBody());
        return $this->_helper->json->sendJson($data);
    }

    /**
     * Update one contact
     * @return json
     */
    public function updateAction()
    {
        $this->getHelper('Layout')->disableLayout();
        $this->getHelper('ViewRenderer')->setNoRender();
        $this->getResponse()->setHeader('Content-Type', 'application/json');
       
        $parameters = json_decode($this->_request->getPost('data'));
        $id = $parameters->id;

        if (!isset($parameters->name) || empty($parameters->name)) {
            throw new Exception("Error, el campo nombre es requerido");
        }

        if ( isset($parameters->term) && !empty($parameters->term)) {
            $parameters->term = $this->_terms[$parameters->term];
        }

        if ( isset($parameters->priceList) && !empty($parameters->priceList)) {
            $parameters->priceList = $this->_priceList[$parameters->priceList];
        }
        
        $this->_client->setUri($this->_uri . '/' . $id);
        $response = $this->_client->setRawData( json_encode($parameters) )->request('PUT');
        $data = json_decode($response->getBody());
        return $this->_helper->json->sendJson($data);
    }

    /**
     * Delete one contact
     * @return json
     */
    public function deleteAction()
    {
        $this->getHelper('Layout')->disableLayout();
        $this->getHelper('ViewRenderer')->setNoRender();
        $this->getResponse()->setHeader('Content-Type', 'application/json');
       
        $data = json_decode($this->_request->getPost('data'));

        $this->_client->setUri($this->_uri . '/' . $data->id);
        $response = $this->_client->request('DELETE');
        $data = json_decode($response->getBody());
        return $this->_helper->json->sendJson($data);
    }

    /**
     * Format type data
     *
     * @param string $data
     * @return stdClass
     */
    private function _formattData($data)
    {
        $jsonData = json_decode($data);
        if (isset($jsonData->data)) {
            foreach ($jsonData->data as $key => $value) {
                if (isset($value->type[0]) && $value->type[0] === 'client') $value->client = TRUE;
                elseif (isset($value->type[0]) && $value->type[0] === 'provider') $value->provider = TRUE;

                if (isset($value->type[1]) && $value->type[1] === 'client') $value->client = TRUE;
                elseif (isset($value->type[1]) && $value->type[1] === 'provider') $value->provider = TRUE;

                if ( isset($value->term->id) && isset($value->term->name) ) $value->term = [ $value->term->name ];
                if ( isset($value->priceList->id) && isset($value->priceList->name) ) $value->priceList = [ $value->priceList->name ];
            }
        }
        return $jsonData;
    }
}

