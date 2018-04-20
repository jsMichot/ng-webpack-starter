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
    $ctrl.editing = true;
    $ctrl.setLaborFactors();

    expect($ctrl.editing).toBe(false);
  });

  it('cancelEdit should set scheduleClassPairs to editValues and editing to false', () => {
    $ctrl.editValues = [{foo: 1}];
    $ctrl.scheduleClassPairs = [{foo: 2}];
    $ctrl.cancelEdit();
    expect($ctrl.scheduleClassPairs).toEqual([{foo: 1}]);
    expect($ctrl.editing).toBe(false);
  });

  it('when editLaborFactor is called editValues and scheduleClassPairs should not point to the same array nor the same objects', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editLaborFactor();
    $ctrl.editValues[0].foo = 2;

    expect($ctrl.scheduleClassPairs).toEqual([{foo: 1}]);
  });

  it('when cancelEdit is called editValues and scheduleClassPairs should not point to the same array nor the same objects (i.e. editValues retains the pre-editing values of scheduleClassPairs)', () => {
    $ctrl.scheduleClassPairs = [{foo: 1}];
    $ctrl.editLaborFactor();
    $ctrl.scheduleClassPairs[0].foo = 2;
    $ctrl.cancelEdit();

    expect($ctrl.editValues).toEqual([{foo: 1}]);
  });

  it('when addNewColumn is called sizes should be cloned to tempSizes (separate arrays) with an added size of the next whole number', () => {
    $ctrl.sizes = [1, 2, 3];
    $ctrl.addNewColumn();
    expect($ctrl.tempSizes).toEqual([1, 2, 3, 4]);
    $ctrl.sizes = [1, 2, 3, 4.34];
    $ctrl.addNewColumn();
    expect($ctrl.tempSizes).toEqual([1, 2, 3, 4.34, 5]);
  });

  it('when addNewColumn is called addingColumn should be set to true', () => {
    $ctrl.addNewColumn();
    expect($ctrl.addingColumn).toBe(true);
  });
  it('when saveNewColumn is called sizes should not contain any duplicates', () => {
    $ctrl.sizes = [1, 2, 3, 3];
    $ctrl.tempSizes = [1, 2, 3, 3, 3];
    $ctrl.saveNewColumn();
    expect($ctrl.sizes).toEqual([1, 2, 3]);
  });

  it('when deleteNewColumn is called addingColumn should be set to false', () => {
    $ctrl.deleteNewColumn();
    expect($ctrl.addingColumn).toBe(false);
  });

  it('when saveNewColumn is called sizes should be sorted', () => {
    const data = [
      {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    ];
    $ctrl.sizes = [1, 2, 3];
    $ctrl.addNewColumn();
    $ctrl.sizes.push(2.5);
    $ctrl.saveNewColumn();
    expect($ctrl.sizes).toEqual([1, 2, 2.5, 3, 4]);
  });

  it('addNewRow should set addingRow to true', () => {
    $ctrl.addingRow = false;
    $ctrl.addNewRow();
    expect($ctrl.addingRow).toBe(true);
  });

  it('saveNewRow should add the new item to data', () => {
    $ctrl.data = [
      {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    ];
    $ctrl.newRowId = 1;
    $ctrl.newRowClass = '200';
    $ctrl.newRowSchedule = '';
    $ctrl.saveNewRow();
    expect($ctrl.data).toEqual([
      {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
      {id: 1, class: '200', schedule: ''},
    ]);
  });

  it('cancelNewRow should set newRowId to 1', () => {
    $ctrl.newRowId = 4;
    $ctrl.cancelNewRow();
    expect($ctrl.newRowId).toBe(1);
  });

  it('cancelNewRow should set newRowClass to an empty string', () => {
    $ctrl.newRowClass = '350';
    $ctrl.cancelNewRow();
    expect($ctrl.newRowClass).toBe('');
  });

  it('cancelNewRow should set newRowSchedule to an empty string', () => {
    $ctrl.newRowSchedule = '3';
    $ctrl.cancelNewRow();
    expect($ctrl.newRowSchedule).toBe('');
  });

  it('cancelNewRow should set addingRow to false', () => {
    $ctrl.addingRow = true;
    $ctrl.cancelNewRow();
    expect($ctrl.addingRow).toBe(false);
  });
});
