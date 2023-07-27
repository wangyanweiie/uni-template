import { ref } from 'vue';
import { getStorage } from '@/utils/uni-storage';

interface subMenuItem {
    label: string;
    value: string;
    icon: string;
    path: string;
}

interface menuItem {
    label: string;
    value: string;
    subMenu: subMenuItem[];
}

/**
 * useIndex
 */
export default function useIndex() {
    /**
     * 权限数组
     */
    const authPermission = ref<any[]>(getStorage('userInfo').appPerms || []);

    /**
     * 菜单列表
     */
    const menuList = ref<menuItem[]>(
        [
            {
                label: '图片水印',
                value: '图片水印',
                subMenu: [
                    {
                        label: '水印测试',
                        value: 'sycs',
                        icon: '',
                        path: '/pages/watermark/index',
                    },
                ],
            },
        ],
        // .map(menu => ({
        //     ...menu,
        //     subMenu: menu.subMenu.filter(sub => {
        //         if (Array.isArray(sub.value)) {
        //             return sub.value.some(val => authPermission.value.includes(val));
        //         }

        //         return authPermission.value.includes(sub.value || menu.value);
        //     }),
        // }))
        // .filter(menu => menu.subMenu.length > 0),
    );

    /**
     * 跳转页面
     */
    function navigateTo(subMenu: subMenuItem) {
        uni.navigateTo({
            url: subMenu.path,
        });
    }

    return {
        menuList,
        navigateTo,
    };
}
