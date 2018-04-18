function ApiService($http, $q) {
  const service = this;

  const resolve = response => response.data;
  const reject = response => $q.reject(response.data);

  service.delete = apiDelete;
  service.get = apiGet;
  service.post = apiPost;
  service.put = apiPut;
  service.getLaborFactorData = getLaborFactorData;

  function apiGet(endpoint) {
    return $http.get(endpoint).then(resolve, reject);
  }

  function apiPost(endpoint, data, httpConfig = {}) {
    return $http.post(endpoint, data, httpConfig).then(resolve, reject);
  }

  function apiPut(endpoint, data) {
    return $http.put(endpoint, data).then(resolve, reject);
  }

  function apiDelete(endpoint, data) {
    return $http({
      url: endpoint,
      method: 'DELETE',
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  function getLaborFactorData() {
    return $q.resolve([
      {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
      {id: 1, size: 3, class: '450', schedule: '80', laborFactor: 1.4},
    ]);
  }
  return service;
}

export default angular
  .module('ng-starter.services.api', [])
  .service('api', ApiService).name;
