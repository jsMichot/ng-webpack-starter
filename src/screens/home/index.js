import './index.scss';
import template from './index.html';
import _ from 'lodash';

export function controller() {
  const $ctrl = this;

  $ctrl.data = [
    {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 2, class: '300', schedule: '', laborFactor: 2.2},
    {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 3, class: '300', schedule: '', laborFactor: 1.3},
    {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
    {id: 1, size: 3, class: '450', schedule: '80', laborFactor: 1.4},
  ];

  $ctrl.$onInit = onInit;
  $ctrl.getLaborFactor = getLaborFactor;
  $ctrl.getSizes = getSizes;
  $ctrl.getScheduleClassPairs = getScheduleClassPairs;
  $ctrl.editing = false;
  $ctrl.editLaborFactor = editLaborFactor;
  $ctrl.setLaborFactors = setLaborFactors;
  $ctrl.cancelEdit = cancelEdit;

  function onInit() {
    $ctrl.sizes = getSizes($ctrl.data);
    $ctrl.scheduleClassPairs = getScheduleClassPairs($ctrl.data, $ctrl.sizes);
  }

  function getSizes(data) {
    const sizeMap = data.reduce(
      (acc, item) => ({...acc, [item.size]: true}),
      {}
    );
    return Object.keys(sizeMap).map(x => parseInt(x, 10));
  }

  function getScheduleClassPairs(data, sizes) {
    return data.reduce((uniquePairs, item) => {
      const currentPair = {
        schedule: item.schedule,
        class: item.class,
      };
      if (_.find(uniquePairs, currentPair)) {
        return uniquePairs;
      }
      for (let size of getSizes(data)) {
        const classScheduleSizeMatch = _.find(data, {
          class: currentPair.class,
          schedule: currentPair.schedule,
          size,
        }) || {laborFactor: 0};

        currentPair[size] = classScheduleSizeMatch.laborFactor;
      }
      return uniquePairs.concat(currentPair);
    }, []);
  }

  function getLaborFactor(schedule, class_, size) {
    return $ctrl.data.reduce((laborFactor, item) => {
      if (
        (item.schedule == schedule || schedule === undefined) &&
        class_ == item.class &&
        item.size == size
      ) {
        laborFactor = item.laborFactor;
      }
      return laborFactor;
    }, 0);
  }

  function editLaborFactor() {
    $ctrl.editValues = $ctrl.scheduleClassPairs.map(pair =>
      Object.assign({}, pair)
    );
    $ctrl.editing = true;
  }

  function setLaborFactors() {
    $ctrl.scheduleClassPairs = $ctrl.editValues.map(pair =>
      Object.assign({}, pair)
    );
    $ctrl.editing = false;
  }

  function cancelEdit() {
    $ctrl.editValues = $ctrl.scheduleClassPairs.map(pair =>
      Object.assign({}, pair)
    );
    $ctrl.editing = false;
  }
}

export default angular
  .module('ng-starter.home', [])
  .component('home', {template, controller}).name;
