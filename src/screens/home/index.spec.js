import module, {controller} from './index';
import apiModule from '../../services/api';

describe('home component', () => {
  let $injector;
  let $rootScope;
  let $controller;
  let api;
  let $ctrl;
  let $q;

  beforeEach(() => {
    angular.mock.module(apiModule, module);

    angular.mock.inject(_$injector_ => {
      $injector = _$injector_;
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');
      api = $injector.get('api');
      $q = $injector.get('$q');
      $ctrl = $controller(controller);
    });
  });

  it('onInit gets data', () => {
    const data = [
      {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    ];

    spyOn(api, 'getLaborFactorData').and.returnValue($q.resolve(data));

    $ctrl.$onInit();
    $rootScope.$digest();

    expect($ctrl.sizes).toEqual([1, 2, 3]);
    expect($ctrl.scheduleClassPairs).toEqual([
      {schedule: '1', class: '150', 1: 1.2, 2: 0, 3: 0},
      {schedule: '2', class: '300', 1: 2.2, 2: 2.2, 3: 0},
      {schedule: '', class: '150', 1: 0, 2: 1.2, 3: 1.2},
      {schedule: '3', class: '300', 1: 0, 2: 0, 3: 1.3},
      {schedule: '', class: '450', 1: 0, 2: 0, 3: 1.4},
    ]);
  });

  it('editLaborFactor should set editValues to scheduleClassPairs', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editLaborFactor();

    expect($ctrl.editing).toBe(true);
    expect($ctrl.editValues).toEqual([{foo: 1}]);
  });

  it('setLaborFactor should set scheduleClassPairs to editValues', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editValues = [{foo: 2}];
    $ctrl.setLaborFactors();

    expect($ctrl.editing).toBe(false);
    expect($ctrl.scheduleClassPairs).toEqual([{foo: 2}]);
  });

  it('cancelEdit should set editValues to scheduleClassPairs and editing to false', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editValues = [{foo: 2}];
    $ctrl.cancelEdit();
    expect($ctrl.editValues).toEqual([{foo: 1}]);
    expect($ctrl.editing).toBe(false);
  });

  it('when editLaborFactor is called editValues and scheduleClassPairs should not point to the same array nor the same objects', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editLaborFactor();
    $ctrl.editValues[0].foo = 2;

    expect($ctrl.scheduleClassPairs).toEqual([{foo: 1}]);
  });
  it('when cancelEdit is called editValues and scheduleClassPairs should not point to the same array nor the same objects', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editLaborFactor();
    $ctrl.editValues[0].foo = 2;
    $ctrl.cancelEdit();
    $ctrl.editLaborFactor();

    expect($ctrl.editValues).toEqual([{foo: 1}]);
  });
  it('when cancelEdit is called scheduleClassPairs should retain pre-editing value', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editLaborFactor();
    $ctrl.editValues[0].foo = 2;
    $ctrl.cancelEdit();

    expect($ctrl.scheduleClassPairs).toEqual([{foo: 1}]);
  });
});
