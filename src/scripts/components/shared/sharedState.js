import TODO from '../../todoModule';

export let sharedRenerer = {run: () => {}};

export default function sharedState(itemObj) {
    return {
        itemObj,
        form: {
            show: false,
            mode: '',
            title: 'form',
            submit: '',
            fields: {
                self: itemObj.fields,
                child: TODO.itemsFallback.getChildFields(itemObj.type),
            },
        },
    };
}
