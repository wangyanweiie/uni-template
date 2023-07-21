import { ref, onBeforeMount } from 'vue';
import type { Options } from '../../interface';
import type { Props, RequestObj } from '../interface';

export default function useIndex(props: Props, emit: Function) {
    /**
     * 下拉值
     */
    const selectValue = ref<string | number>('');

    /**
     * 下拉值对应的 label
     */
    const selectLabel = ref<string>('');

    /**
     * 下拉列表
     */
    const selectList = ref<Options[]>([]);

    /**
     * @description 下拉框改变
     * @param e 当前下拉项
     */
    function handleChange(e: string | number) {
        if (e) {
            // 根据 value 过滤出当前下拉项的 label
            selectLabel.value = selectList.value.filter((item: Options) => item.value === e)[0]?.label;
        } else {
            // 清空
            selectLabel.value = '';
        }

        emit('handleSelect', {
            value: { label: selectLabel.value, value: selectValue.value },
            schema: props.schema,
            isClear: e ? false : true,
        });
    }

    /**
     * 请求下拉数据
     */
    async function handleSelect() {
        if (props.schema?.api) {
            const res: RequestObj = await props.schema?.api({
                ...props.schema?.apiParams,
            });

            if (res) {
                selectList.value = res.data as Options[];
            } else {
                selectList.value = [];
            }
        } else if (props.schema?.options?.length) {
            selectList.value = props.schema?.options;
        } else {
            selectList.value = [];
        }
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(async () => {
        // 默认值
        if (props.schema?.defaultValue) {
            handleSelect();

            selectList.value.forEach((item: Options) => {
                if (item.value === props.schema?.defaultValue) {
                    selectValue.value = item.value;
                    selectLabel.value = item.label;
                }
            });

            emit('handleSelect', {
                value: { label: selectLabel.value, value: selectValue.value },
                schema: props.schema,
                isClear: false,
            });
        }
    });

    return {
        selectValue,
        selectLabel,
        selectList,
        handleChange,
        handleSelect,
    };
}
