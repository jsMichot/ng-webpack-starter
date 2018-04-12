import './index.scss';
import template from './index.html';

function controller() {
  const $ctrl = this;

  $ctrl.data = [
    {id: 1, size: 1, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 1, class: '300', schedule: '', laborFactor: 2.2},
    {id: 1, size: 2, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 2, class: '300', schedule: '', laborFactor: 2.2},
    {id: 1, size: 3, class: '150', schedule: '', laborFactor: 1.2},
    {id: 1, size: 3, class: '300', schedule: '', laborFactor: 1.3},
    {id: 1, size: 3, class: '450', schedule: '', laborFactor: 1.4},
  ];

  $ctrl.sizes = $ctrl.data.reduce((sizes, item) => {
    return sizes.includes(item.size) ? sizes : sizes.concat(item.size);
  }, []);

  $ctrl.classes = $ctrl.data.reduce((classes, item) => {
    return classes.includes(item.class) ? classes : classes.concat(item.class);
  }, []);

  $ctrl.schedule = $ctrl.data.reduce((schedule, item) => {
    return schedule.includes(item.schedule) ? schedule : schedule.concat(item.schedule);
  }, []);

  $ctrl.getLaborFactor = (sch, cl, siz) =>
    $ctrl.data.reduce((lf, item) => {
      const {size, schedule, laborFactor} = item;
      if ((sch == schedule || sch === undefined) && cl == item.class && siz == size) {
        lf = laborFactor;
      }
      return lf;
    }, 0);

  $ctrl.$onInit = () => {
    console.log('home init');
  };
}

export default angular.module('ng-starter.home', []).component('home', {template, controller}).name;
