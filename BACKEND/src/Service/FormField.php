<?php

namespace App\Service;

/**
 * FormField represents a single form field configuration.
 * This class defines the structure and validation for dynamic form fields.
 */
class FormField
{
    public function __construct(
        private string $key,
        private string $label,
        private string $type,
        private bool $required = false,
        private bool $visible = true,
        private ?array $options = null,
        private ?string $placeholder = null,
        private ?string $inputType = null,
        private ?int $order = null
    ) {
    }

    public function getKey(): string
    {
        return $this->key;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function isRequired(): bool
    {
        return $this->required;
    }

    public function isVisible(): bool
    {
        return $this->visible;
    }

    public function getOptions(): ?array
    {
        return $this->options;
    }

    public function getPlaceholder(): ?string
    {
        return $this->placeholder;
    }

    public function getInputType(): ?string
    {
        return $this->inputType;
    }

    public function getOrder(): ?int
    {
        return $this->order;
    }

    public function setLabel(string $label): self
    {
        $this->label = $label;
        return $this;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function setRequired(bool $required): self
    {
        $this->required = $required;
        return $this;
    }

    public function setVisible(bool $visible): self
    {
        $this->visible = $visible;
        return $this;
    }

    public function setOptions(?array $options): self
    {
        $this->options = $options;
        return $this;
    }

    public function setPlaceholder(?string $placeholder): self
    {
        $this->placeholder = $placeholder;
        return $this;
    }

    public function setInputType(?string $inputType): self
    {
        $this->inputType = $inputType;
        return $this;
    }

    public function setOrder(?int $order): self
    {
        $this->order = $order;
        return $this;
    }

    /**
     * Convert to array representation
     */
    public function toArray(): array
    {
        return [
            'key' => $this->key,
            'label' => $this->label,
            'type' => $this->type,
            'required' => $this->required,
            'visible' => $this->visible,
            'options' => $this->options,
            'placeholder' => $this->placeholder,
            'inputType' => $this->inputType,
            'order' => $this->order,
        ];
    }

    /**
     * Create from array
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['key'],
            $data['label'],
            $data['type'],
            $data['required'] ?? false,
            $data['visible'] ?? true,
            $data['options'] ?? null,
            $data['placeholder'] ?? null,
            $data['inputType'] ?? null,
            $data['order'] ?? null
        );
    }
}
