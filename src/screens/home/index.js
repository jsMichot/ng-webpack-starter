import './index.scss';
import template from './index.html';
import _ from 'lodash';
// import ApiService from '../../services/api.js';

export function controller(api) {
  const $ctrl = this;

  $ctrl.data = [];

  $ctrl.$onInit = onInit;
  $ctrl.editing = false;
  $ctrl.editLaborFactor = editLaborFactor;
  $ctrl.setLaborFactors = setLaborFactors;
  $ctrl.cancelEdit = cancelEdit;

  function onInit() {
    api.getLaborFactorData().then(value => {
      $ctrl.data = value;
      $ctrl.sizes = getSizes($ctrl.data);
      $ctrl.scheduleClassPairs = getScheduleClassPairs($ctrl.data, $ctrl.sizes);
    });
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
