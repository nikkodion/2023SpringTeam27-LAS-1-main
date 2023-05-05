import requests
#Generate a function to test a django file upload endpoing
def testEndpoint():
    
    #Create a file object to upload
    file = open(r"Z:\CSAM download temp\dp-rules-configuration_subset.csv", "rb")
    #Create a request object to send to the endpoint
    request = requests.post("http://localhost:8000/Import/rules/", data=file)
    #Print the response
    print(request.text)     
    
testEndpoint()