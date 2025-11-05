export const MenuList = [
  // {
  //   title: "General",
  //   lanClass: "lan-1",
  //   Items: [
  //         {
  //           path: "/admin/dashboard",
  //           icon: "home",
  //           title: "Dashboard",
  //           type: "link",
  //           lanClass: "lan-4",
  //         },
  //       ],
  // },
  {
    title: "Menú Administrador",
    lanClass: "lan-1",
    Items: [
      {
        title: "Liquidaciones",
        icon: "file",
        type: "sub",
        children: [
          {
            path: "/admin/liquidacion",
            title: "Nueva Liquidación",
            type: "link",
            permission: "liquidation.create",
          },
          {
            path: "/admin/liquidaciones_guardadas",
            title: "Guardadas",
            type: "link",
            permission: "liquidation.view",
          },
          {
            path: "/admin/volantes_pago",
            title: "Volantes de Pago",
            type: "link",
            permission: "payslip.view",
          },
          // {
          //   path: "/admin/reporte_novedades",
          //   title: "Reporte Novedades",
          //   type: "link",
          // },
        ],
      },
      // {
      //   path: "/admin/usuarios",
      //   icon: "user",
      //   title: "Usuarios",
      //   type: "link",
      // },
      {
        path: "/admin/empresas",
        icon: "file",
        title: "Empresas",
        type: "link",
        permission: "company.view",
      },
      {
        path: "/admin/normativas",
        icon: "file",
        title: "Normativas",
        type: "link",
        permission: "normative.view",
      },
      {
        path: "/admin/empleados",
        icon: "file",
        title: "Empleados",
        type: "link",
        permission: "employee.view",
      },
      {
        path: "/admin/contratos",
        icon: "file",
        title: "Contratos",
        type: "link",
        permission: "employee.view",
      },
      {
        path: "/admin/novedades",
        icon: "file",
        title: "Novedades",
        type: "link",
        permission: "news.view",
      },
      {
        path: "/admin/novedades_empleados",
        icon: "file",
        title: "Registrar Novedades",
        type: "link",
        permission: "news.register",
      },
      {
        path: "/admin/aprobacion_novedades",
        icon: "file",
        title: "Aprobar Novedades",
        type: "link",
        permission: "news.approve",
      },
      {
        path: "/admin/configuracion",
        icon: "setting",
        title: "Configuración",
        type: "link",
        permission: "config.users", // Cualquiera de los permisos de configuración
      },
      // {
      //   path: "/admin/eventos",
      //   icon: "calendar",
      //   title: "Eventos",
      //   type: "link",
      // },
      // {
      //   path: "/admin/banners",
      //   icon: "gallery",
      //   title: "Banners",
      //   type: "link",
      // },
      // {
      //   path: "/admin/testimonios",
      //   icon: "chat",
      //   title: "Testimonios",
      //   type: "link",
      // },
      // {
      //   path: "/admin/estadisticas",
      //   icon: "charts",
      //   title: "Estadisticas",
      //   type: "link",
      // },
      // {
      //   path: "/admin/block-emails",
      //   icon: "others",
      //   title: "Bloqueo Emails",
      //   type: "link",
      // },
      // {
      //   path: "/admin/subdominios",
      //   icon: "search",
      //   title: "Subdominios",
      //   type: "link",
      // },
      // {
      //   path: "/admin/antes-despues",
      //   icon: "bonus-kit",
      //   title: "Antes y Despues",
      //   type: "link",
      // },
      // { path: "/admin/blogs", icon: "blog", title: "Blogs", type: "link" },
      // {
      //   path: "/admin/solicitar-testimonios",
      //   icon: "chat",
      //   title: "Solicitar Testimonios",
      //   type: "link",
      // },
    ],
  },
  // {
  //   title: "Formularios",
  //   lanClass: "lan-1",
  //   Items: [
  //     {
  //       path: "/admin/contacto",
  //       icon: "contact",
  //       title: "Contacto",
  //       type: "link",
  //     },
  //     {
  //       path: "/admin/contratos",
  //       icon: "project",
  //       title: "Contratos",
  //       type: "link",
  //     },
  //     {
  //       path: "/admin/cotizar-seguro",
  //       icon: "editors",
  //       title: "Cotización de Seguro",
  //       type: "link",
  //     },
  //     {
  //       path: "/admin/ayuda-seguro",
  //       icon: "maps",
  //       title: "Ayuda Turismo",
  //       type: "link",
  //     },
  //     {
  //       path: "/admin/whatsapp-contacts.",
  //       icon: "chat",
  //       title: "WhatsApp Contacts",
  //       type: "link",
  //     },
  //   ],
  // },
  // {
  //   title: "CRM",
  //   lanClass: "lan-1",
  //   Items: [
  //     {
  //       path: "/crm/por-hacer",
  //       icon: "task",
  //       title: "Por Hacer",
  //       type: "link",
  //     },
  //     { path: "/crm/clientes", icon: "user", title: "Clientes", type: "link" },
  //   ],
  // },
  // {
  //   title: "Forms & Table",
  //   Items: [
  //     {
  //       title: "Forms",
  //       id: 17,
  //       icon: "form",
  //       type: "sub",
  //       active: false,
  //       children: [
  //         {
  //           title: "Form Controls",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/forms/form_controls/validation_form",
  //               title: "Form Validation",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_controls/base_input",
  //               title: "Base Inputs",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_controls/checkbox_radio",
  //               title: "Checkbox & Radio",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_controls/input_groups",
  //               title: "Input Groups",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_controls/input_mask",
  //               title: "Input Mask",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_controls/mega_option",
  //               title: "Mega Option",
  //               type: "link",
  //             },
  //           ],
  //         },
  //         {
  //           title: "Form Widget",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/forms/form_widget/datepicker",
  //               title: "Datepicker",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_widget/touchspin",
  //               title: "Touchspin",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_widget/switch",
  //               title: "Switch",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_widget/typeahead",
  //               title: "Typeahead",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_widget/clipboard",
  //               title: "Clipboard",
  //               type: "link",
  //             },
  //           ],
  //         },
  //         {
  //           title: "Form Layout",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/forms/form_layout/form_wizard_1",
  //               title: "Form Wizard 1",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_layout/form_wizard_2",
  //               title: "Form Wizard 2",
  //               type: "link",
  //             },
  //             {
  //               path: "/forms/form_layout/two_factor",
  //               title: "Two Factor",
  //               type: "link",
  //             },
  //           ],
  //         },
  //       ],
  //     },

  //     {
  //       title: "Table",
  //       icon: "table",
  //       id: 18,
  //       type: "sub",
  //       children: [
  //         {
  //           title: "Reactstrap Tables",
  //           type: "sub",
  //           children: [
  //             {
  //               title: "Basic Tables",
  //               type: "link",
  //               path: "/table/reactstrap_table/basic_table",
  //             },
  //             {
  //               title: "Table Components",
  //               type: "link",
  //               path: "/table/reactstrap_table/table_component",
  //             },
  //           ],
  //         },
  //         {
  //           title: "Data Tables",
  //           type: "sub",
  //           children: [
  //             {
  //               path: "/table/data_table/basic_init",
  //               title: "Basic Init",
  //               type: "link",
  //             },
  //             {
  //               path: "/table/data_table/advance_init",
  //               title: "Advance Init",
  //               type: "link",
  //             },
  //             { path: "/table/data_table/api", title: "API", type: "link" },
  //             {
  //               path: "/table/data_table/data_sources",
  //               title: "Data Source",
  //               type: "link",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
];
