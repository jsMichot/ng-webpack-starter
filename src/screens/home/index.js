import './index.scss';
import template from './index.html';
import _ from 'lodash';
// import ApiService from '../../services/api.js';

export function controller(api) {
  const $ctrl = this;

  $ctrl.data = [];
  $ctrl.sizes = [];
  $ctrl.tempSizes = [];

  $ctrl.$onInit = onInit;
  $ctrl.editing = false;
  $ctrl.addingColumn = false;
  $ctrl.addingRow = false;
  $ctrl.editLaborFactor = editLaborFactor;
  $ctrl.setLaborFactors = setLaborFactors;
  $ctrl.cancelEdit = cancelEdit;
  $ctrl.addNewColumn = addNewColumn;
  $ctrl.deleteNewColumn = deleteNewColumn;
  $ctrl.saveNewColumn = saveNewColumn;
  $ctrl.addNewRow = addNewRow;
  $ctrl.saveNewRow = saveNewRow;
  $ctrl.cancelNewRow = cancelNewRow;
  $ctrl.newRowId = 1;
  $ctrl.newRowClass = '';
  $ctrl.newRowSchedule = '';

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
      $ctrl.sizes.forEach(size => {
        const classScheduleSizeMatch = _.find(data, {
          class: currentPair.class,
          schedule: currentPair.schedule,
          size,
        }) || {laborFactor: 0};

        currentPair[size] = classScheduleSizeMatch.laborFactor;
      });
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
    $ctrl.editing = false;
  }

  function cancelEdit() {
    $ctrl.scheduleClassPairs = $ctrl.editValues.map(pair =>
      Object.assign({}, pair)
    );
    $ctrl.editing = false;
  }

  function addNewColumn() {
    $ctrl.tempSizes = $ctrl.sizes.slice() || [];
    $ctrl.tempSizes.push(
      Math.floor(parseInt($ctrl.sizes[$ctrl.sizes.length - 1]) + 1)
    );
    $ctrl.addingColumn = true;
  }

  function deleteNewColumn() {
    $ctrl.addingColumn = false;
  }

  function saveNewColumn() {
    $ctrl.sizes = _.uniq($ctrl.tempSizes).sort();
    $ctrl.scheduleClassPairs = getScheduleClassPairs($ctrl.data, $ctrl.sizes);

    $ctrl.addingColumn = false;
  }

  function addNewRow() {
    $ctrl.addingRow = true;
  }

  function saveNewRow() {
    $ctrl.data.push({
      id: $ctrl.newRowId,
      class: $ctrl.newRowClass,
      schedule: $ctrl.newRowSchedule,
    });
    $ctrl.scheduleClassPairs = getScheduleClassPairs($ctrl.data, $ctrl.sizes);
    $ctrl.cancelNewRow();
  }

  function cancelNewRow() {
    $ctrl.newRowId = 1;
    $ctrl.newRowClass = '';
    $ctrl.newRowSchedule = '';
    $ctrl.addingRow = false;
  }
}

export default angular
  .module('ng-starter.home', [])
  .component('home', {template, controller}).name;
