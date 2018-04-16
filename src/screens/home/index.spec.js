import module, {controller} from './index';
describe('home component', () => {
  let $injector;
  let $rootScope;
  let $controller;
  let $ctrl;

  beforeEach(() => {
    angular.mock.module(module);

    angular.mock.inject(_$injector_ => {
      $injector = _$injector_;
      $rootScope = $injector.get('$rootScope');
      $controller = $injector.get('$controller');

      $ctrl = $controller(controller);
    });
  });

  it('getSizes correctly returns unique array of sizes', () => {
    const data = [
      {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    ];

    const result = $ctrl.getSizes(data);
    expect(result).toEqual([1, 2, 3]);
  });

  it('getScheduleClassPairs correctly returns unique array of scheduleClassPairs', () => {
    const data = [
      {id: 1, size: 1, class: '150', schedule: '1', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '2', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '3', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    ];

    const result = $ctrl.getScheduleClassPairs(data);
    expect(result).toEqual([
      {schedule: '1', class: '150', 1: 1.2, 2: 0, 3: 0},
      {schedule: '2', class: '300', 1: 2.2, 2: 2.2, 3: 0},
      {schedule: '', class: '150', 1: 0, 2: 1.2, 3: 1.2},
      {schedule: '3', class: '300', 1: 0, 2: 0, 3: 1.3},
      {schedule: '', class: '450', 1: 0, 2: 0, 3: 1.4},
    ]);
  });
  it('getLaborFactor returns the correct laborFactor for a given schedule, class, size', () => {
    const data = [
      {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 1, class: '300', schedule: '', laborFactor: 2.2},
      {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 2, class: '300', schedule: '', laborFactor: 2.2},
      {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
      {id: 1, size: 3, class: '300', schedule: '', laborFactor: 1.3},
      {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    ];

    const result = $ctrl.getLaborFactor('', 150, 2);
    expect(result).toEqual(1.2);
  });

  it('editLaborFactor should set editValues to scheduleClassPairs', () => {
    $ctrl.scheduleClassPairs = {foo: 1};
    $ctrl.editLaborFactor();

    expect($ctrl.editing).toBe(true);
    expect($ctrl.editValues).toEqual({foo: 1});
  });

  it('setLaborFactor should set scheduleClassPairs to editValues', () => {
    $ctrl.scheduleClassPairs = {foo: 1};
    $ctrl.editValues = {foo: 2};
    $ctrl.setLaborFactors();

    expect($ctrl.editing).toBe(false);
    expect($ctrl.scheduleClassPairs).toEqual({foo: 2});
  });
});
