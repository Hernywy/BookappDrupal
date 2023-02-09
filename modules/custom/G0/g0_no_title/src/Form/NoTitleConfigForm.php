<?php

  namespace Drupal\g0_no_title\Form;

  use Drupal\Core\Form\FormBase;
  use Drupal\Core\Form\FormStateInterface;

  class NoTitleConfigForm extends FormBase {

    /**
     * {@inheritdoc}
     */
    public function getFormId() {
      return 'g0_no_title_settings';
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(array $form, FormStateInterface $form_state) {
      $config = \Drupal::config('g0_no_title.settings');
      $form['g0_no_title_config_form_description'] = [
        '#markup' => '<p>' . t('This module will remove the title field from the node form.') . '</p>',
      ];

      // Show the list of content types and allow the user to select which ones could have the title field removed.
      $types = \Drupal::entityTypeManager()->getStorage('node_type')->loadMultiple();
      foreach ($types as $type) {
        $form['g0_no_title_config_form_type_' . $type->id()] = [
          '#type' => 'checkbox',
          '#title' => $type->label(),
          '#default_value' => $config->get('type.' . $type->id()),
        ];
        $form['g0_no_title_config_form_expression_' . $type->id()] = [
          '#type' => 'textfield',
          '#title' => t('Expression to build the title.') . t(' Example:') . 
              '<br> {field_texto:value} - {field_fecha:value} or' .
              '<br> {field_servicio_sel:nid} - {field_servicio_sel:title} - {field_servicio_sel:body:value}'.
              '<br> {node_parent:nid} - {node_parent:title}'.              
              '<br> allowed tokens: {*:nid} - {*:vid} - {*:id} - {*:title} - {*:value}',
          '#default_value' => $config->get('expression.' . $type->id()),
        ];
      }

      $form['g0_no_title_config_form_submit'] = [
        '#type' => 'submit',
        '#value' => t('Save configuration'),
      ];

      return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function submitForm(array &$form, FormStateInterface $form_state) {
      $config = \Drupal::configFactory()->getEditable('g0_no_title.settings');
      foreach ($form_state->getValues() as $key => $value) {
        if (strpos($key, 'g0_no_title_config_form_type_') === 0) {
          $type = str_replace('g0_no_title_config_form_type_', '', $key);
          $config->set('type.' . $type, $value);
        }
        if (strpos($key, 'g0_no_title_config_form_expression_') === 0) {
          $type = str_replace('g0_no_title_config_form_expression_', '', $key);
          $config->set('expression.' . $type, $value);
        }
      }
      $config->save();
      \Drupal::messenger()->addStatus(t('The configuration options have been saved.'));      
    }
  }
