<?php

class train
{
	// Params
	private $soap = NULL; // soap connection
	private $accessKey = NULL; // api key
	private $wsdl = 'http://lite.realtime.nationalrail.co.uk/OpenLDBWS/wsdl.aspx';
	
	
	//  PHP will automatically call this function when you create an object from a class
	function __construct($accessKey)
	{
		$this->accessKey = $accessKey; // Retreive accessKey passed when calls are made
		$soapOptions = array(); // Any options to pass to Soap connection here
		$this->soapClient = new SoapClient($this->wsdl,$soapOptions); // create new SoapClient connection
		
		$soapVar = new SoapVar(array("ns2:TokenValue"=>$this->accessKey),SOAP_ENC_OBJECT);
		$soapHeader = new SoapHeader("http://thalesgroup.com/RTTI/2010-11-01/ldb/commontypes","AccessToken",$soapVar);
		$this->soapClient->__setSoapHeaders($soapHeader);
	}
	
	// Make call for train data
	function GetDepBoardWithDetails($numRows, $crs, $filterCrs="", $filterType="", $timeOffset="", $timeWindow="")
	{
		// Params for the connection
		$params = array();
		$params["numRows"] = $numRows;
		$params["crs"] = $crs;

		if ($filterCrs) $params["filterCrs"] = $filterCrs;
		if ($filterType) $params["filterType"] = $filterType;
		if ($timeOffset) $params["timeOffset"] = $timeOffset;
		if ($timeWindow) $params["timeWindow"] = $timeWindow;
		
		// Make the connection
		try
		{
			$response = $this->soapClient->GetDepBoardWithDetails($params);
		}
		catch(SoapFault $soapFault)
		{
			trigger_error("Something's wrong", E_USER_ERROR);
		}

		// pass data back
		return (isset($response) ? $response : false);
	}
}
