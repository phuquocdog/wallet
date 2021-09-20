package dog.phuquoc.wallet;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.PersistableBundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "phuquocdogWallet";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //SplashScreen.show(this);
        super.onCreate(savedInstanceState);
              
    }
}
