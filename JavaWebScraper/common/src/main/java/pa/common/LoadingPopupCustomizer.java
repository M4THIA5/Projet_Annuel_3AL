package pa.common;

import javafx.concurrent.Task;
import javafx.stage.Stage;
import org.pf4j.ExtensionPoint;

public interface LoadingPopupCustomizer extends ExtensionPoint {
    Stage createLoadingPopup(Task<?> task, String keywords);
}
