/* =====================================================
   ROOT FORM SCHEMA
===================================================== */

export interface FormSchema {

  /* identity */
  id?: string;
  code?: string;

  /* basic */
  name: string;
  description?: string;

  menuLabel?: string;
  icon?: string;
  /* layout */
  columns: 1 | 2 | 3 | 4 | 5;
  labelPosition?: 'top' | 'left' | 'floating';

  /* behaviour */
  submitLabel?: string;
  resetLabel?: string;
  showSubmit?: boolean;
  showReset?: boolean;

  /* security */
  roles?: string[];
  isActive?: boolean;

  /* UI */
  cssClass?: string;
  style?: { [key: string]: string };

  /* sections */
  sections: FormSection[];

  /* grids/tables */
  grids?: FormGrid[];

  /* events */
  events?: FormEvent[];

  /* metadata */
  createdOn?: Date;
  modifiedOn?: Date;
}



/* =====================================================
   SECTION / GROUP (card/fieldset/tabs)
===================================================== */

export interface FormSection {

  id?: string;

  title?: string;
  description?: string;

  collapsible?: boolean;
  collapsed?: boolean;

  columns?: 1 | 2 | 3;

  cssClass?: string;

  fields: FieldSchema[];
}



/* =====================================================
   FIELD (main building block)
===================================================== */

export interface FieldSchema {

  /* identity */
  id?: string;
  name: string;

  /* display */
  label: string;
  type: FieldType;

  placeholder?: string;
  hint?: string;
  tooltip?: string;

  /* layout */
  columnSpan?: 1 | 2 | 3;
  order?: number;

  cssClass?: string;
  style?: { [key: string]: string };

  /* default/value */
  defaultValue?: any;
  readonly?: boolean;
  disabled?: boolean;
  hidden?: boolean;

  /* validation */
  validations?: ValidationRule[];

  /* select/radio/checkbox */
  options?: OptionSchema[];

  /* dynamic dropdown from API */
  dataSource?: DataSource;

  /* visibility rules */
  visibleWhen?: ConditionRule;

  /* enable/disable rules */
  enableWhen?: ConditionRule;

  /* calculations */
  formula?: string;   // ex: qty * price

  /* nested fields (repeatable/group) */
  children?: FieldSchema[];
}



/* =====================================================
   FIELD TYPES
===================================================== */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'decimal'
  | 'password'
  | 'email'
  | 'mobile'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'file'
  | 'image'
  | 'color'
  | 'range'
  | 'url'
  | 'label'
  | 'heading'
  | 'html'
  | 'group'
  | 'array';


  export const FIELD_TYPES: FieldType[] = [
  'text','textarea','number','decimal','password','email','mobile',
  'date','datetime','time','select','multiselect','radio','checkbox',
  'switch','file','image','color','range','url','label','heading',
  'html','group','array'
];



/* =====================================================
   OPTIONS
===================================================== */

export interface OptionSchema {
  label: string;
  value: any;

  disabled?: boolean;
  group?: string;   // for optgroup
  icon?: string;
}



/* =====================================================
   VALIDATION
===================================================== */

export interface ValidationRule {

  type:
  | 'required'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'custom';

  value?: any;
  message?: string;
}



/* =====================================================
   API DATA SOURCE
===================================================== */

export interface DataSource {

  url: string;

  method?: 'GET' | 'POST';

  valueField?: string;
  textField?: string;

  dependsOn?: string; // cascading dropdown
}



/* =====================================================
   CONDITIONS
===================================================== */

export interface ConditionRule {

  field: string;
  operator:
  | '=='
  | '!='
  | '>'
  | '<'
  | '>='
  | '<='
  | 'contains';

  value: any;
}



/* =====================================================
   GRID / TABLE (multiple rows)
===================================================== */

export interface FormGrid {

  id?: string;

  name: string;
  title?: string;

  addButtonLabel?: string;
  deleteButtonLabel?: string;

  columns: GridColumn[];

  minRows?: number;
  maxRows?: number;
}



export interface GridColumn {

  name: string;
  label: string;
  type: FieldType;

  validations?: ValidationRule[];

  options?: OptionSchema[];
}



/* =====================================================
   EVENTS
===================================================== */

export interface FormEvent {

  event:
  | 'onLoad'
  | 'onSubmit'
  | 'onChange'
  | 'onSave';

  action: string; // api call / script name
}

export type FieldCategory =
  | 'basic'
  | 'numeric'
  | 'date'
  | 'selection'
  | 'advanced'
  | 'layout';

export interface FieldTypeConfig {
  type: FieldType;
  label: string;
  icon: string;
  category: FieldCategory;
  defaultConfig?: Partial<FieldSchema>;
}


export const FIELD_TYPE_CONFIGS: FieldTypeConfig[] = [

  // ---------------- BASIC ----------------
  {
    type: 'text',
    label: 'Text',
    icon: 'text_fields',
    category: 'basic',
    defaultConfig: { placeholder: 'Enter text' }
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: 'notes',
    category: 'basic'
  },
  {
    type: 'email',
    label: 'Email',
    icon: 'mail',
    category: 'basic'
  },
  {
    type: 'password',
    label: 'Password',
    icon: 'lock',
    category: 'basic'
  },

  // ---------------- NUMERIC ----------------
  {
    type: 'number',
    label: 'Number',
    icon: 'pin',
    category: 'numeric'
  },
  {
    type: 'decimal',
    label: 'Decimal',
    icon: 'calculate',
    category: 'numeric'
  },
  {
    type: 'range',
    label: 'Range Slider',
    icon: 'tune',
    category: 'numeric'
  },

  // ---------------- DATE ----------------
  {
    type: 'date',
    label: 'Date',
    icon: 'calendar_today',
    category: 'date'
  },
  {
    type: 'datetime',
    label: 'DateTime',
    icon: 'event',
    category: 'date'
  },
  {
    type: 'time',
    label: 'Time',
    icon: 'schedule',
    category: 'date'
  },

  // ---------------- SELECTION ----------------
  {
    type: 'select',
    label: 'Dropdown',
    icon: 'arrow_drop_down_circle',
    category: 'selection',
    defaultConfig: { options: [] }
  },
  {
    type: 'multiselect',
    label: 'Multi Select',
    icon: 'checklist',
    category: 'selection'
  },
  {
    type: 'radio',
    label: 'Radio',
    icon: 'radio_button_checked',
    category: 'selection'
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'check_box',
    category: 'selection'
  },
  {
    type: 'switch',
    label: 'Switch',
    icon: 'toggle_on',
    category: 'selection'
  },

  // ---------------- ADVANCED ----------------
  {
    type: 'file',
    label: 'File Upload',
    icon: 'upload_file',
    category: 'advanced'
  },
  {
    type: 'image',
    label: 'Image Upload',
    icon: 'image',
    category: 'advanced'
  },
  {
    type: 'color',
    label: 'Color Picker',
    icon: 'palette',
    category: 'advanced'
  },
  {
    type: 'url',
    label: 'URL',
    icon: 'link',
    category: 'advanced'
  },

  // ---------------- LAYOUT ----------------
  {
    type: 'heading',
    label: 'Heading',
    icon: 'title',
    category: 'layout'
  },
  {
    type: 'label',
    label: 'Label',
    icon: 'label',
    category: 'layout'
  },
  {
    type: 'html',
    label: 'HTML',
    icon: 'code',
    category: 'layout'
  },
  {
    type: 'group',
    label: 'Group',
    icon: 'folder',
    category: 'layout'
  },
  {
    type: 'array',
    label: 'Repeatable',
    icon: 'view_list',
    category: 'layout'
  }

];

