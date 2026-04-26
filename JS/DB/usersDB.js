function getAllClients() {
    let AllClientsData = localStorage.getItem('allClients');
    if (AllClientsData == null) {
        localStorage.setItem('allClients', JSON.stringify([]));
        return [];
    }
    let allClients = JSON.parse(AllClientsData);
    return allClients;
}
function getClientByID(clientID) {
    const allClients = getAllClients();
    const client = allClients.find(user => user.idNumber == clientID);
    if (!client)
        return null;
    return client;
}
function addClient(client) {
    const allClients = getAllClients();
    allClients.push(client);
    localStorage.setItem('allClients', JSON.stringify(allClients));
    return client.idNumber;
}
function deleteClient(clientID) {
    const allClients = getAllClients();
    let updatedClientArr = allClients.filter(user => user.idNumber != clientID);
    if (allClients.length == updatedClientArr.length)
        throw { status: 404 }
    localStorage.setItem('allClients', JSON.stringify(updatedClientArr))
}