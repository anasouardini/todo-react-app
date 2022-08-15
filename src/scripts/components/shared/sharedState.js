import TODO from '../../todoModule';

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
