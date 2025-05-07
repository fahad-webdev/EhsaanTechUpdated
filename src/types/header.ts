export interface MenuItem {
    id?: string;
    label?: string;
    icon?: string;
    url?: string;
    items?: MenuItem[] | MenuItem[][];
    expanded?: boolean;
    disabled?: boolean;
    visible?: boolean;
    target?: string;
    separator?: boolean;
    style?: React.CSSProperties;
    className?: string;
    template?: React.ReactNode;
    badge?: number;
    shortcut?: string;
}



  
  
  
 