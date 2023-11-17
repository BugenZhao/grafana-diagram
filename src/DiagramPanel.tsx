import { DataFrame, PanelProps } from '@grafana/data';
import { stylesFactory, useTheme2 } from '@grafana/ui';
import { DiagramPanelController } from 'DiagramController';
import { css, cx } from '@emotion/css';
import { getDiagramSeriesModel } from 'getDiagramSeriesModel';
import React from 'react';
import { DiagramOptions } from 'config/types';

export interface DiagramPanelOptions extends PanelProps<DiagramOptions> {}

const findDefinitionFromData = (all_series: DataFrame[]) => {
  for (const series of all_series) {
    if (series.fields.length === 1) {
      const field = series.fields[0];
      if (field.name === 'content' && field.type === 'string') {
        if (field.values.length === 1) {
          const value: string = field.values.get(0);
          return value;
        }
      }
    }
  }
  return undefined;
};

export const DiagramPanel: React.FC<DiagramPanelOptions> = ({
  id,
  data,
  timeZone,
  width,
  height,
  options,
  fieldConfig,
  replaceVariables,
  onOptionsChange,
  onChangeTimeRange,
}) => {
  const theme = useTheme2();
  const styles = getStyles();

  if (!data) {
    return (
      <div className="panel-empty">
        <p>No data found in response</p>
      </div>
    );
  }

  const diagramModels = getDiagramSeriesModel(data.series, timeZone, options, theme, fieldConfig);
  const definitionFromData = findDefinitionFromData(data.series);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <DiagramPanelController
        theme={theme}
        id={id}
        data={diagramModels}
        timeZone={timeZone}
        width={width}
        height={height}
        options={options}
        definitionFromData={definitionFromData}
        fieldConfig={fieldConfig}
        replaceVariables={replaceVariables}
        onOptionsChange={onOptionsChange}
        onChangeTimeRange={onChangeTimeRange}
      ></DiagramPanelController>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
  };
});
