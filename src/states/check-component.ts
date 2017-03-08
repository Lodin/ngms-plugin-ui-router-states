import {isComponent} from 'ng-metasys';

type CheckComponent = (declaration: any) => void;
const checkComponent: CheckComponent =
  declaration => {
    if (typeof declaration !== 'function') {
      throw new Error('State component should be a class declaration');
    }

    if (!isComponent(declaration)) {
      throw new Error(`Declaration ${declaration.name} should be marked as a ng-metasys`
        + '@Component');
    }
  };

export {CheckComponent};
export default checkComponent;
